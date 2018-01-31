namespace nano {
    'use strict';

    /**
     * This loader can load ES6 modules, commonjs modules, and namespace "modules".
     * 
     * This loader is based on require1k with the following modifications:
     * - Catched exceptions will be rethrown in function R
     * - Added strict mode
     * 
     * Notes
     * - To load app modules, start path with a ".", e.g. "./my-module"
     * - To load "node_modules", do NOT prefix the path, e.g. "jquery/dist/jquery"
     * 
     */

    // When the process of loading a module is started, a ModuleInfo object will be added to this index, to prevent "repetitive" loading of modules.
    const MODULES: ModuleInfoIndex = {};

    // Used to load stylesheets only once.
    const stylesheets: StylesheetIndex = {};

    // By using a named "eval" most browsers will execute in the global scope.
    // http://perfectionkills.com/global-eval-what-are-the-options/
    const globalEval = eval;

    // An "base" element is added to the header to correctly resolve relative paths.
    const baseElement: HTMLBaseElement = document.createElement("base");
    const headElement: HTMLHeadElement = document.head;
    headElement.appendChild(baseElement);

    // This "anchor" element is only used to resolve relative paths to absolute url paths.
    // E.g. "./app" will resolve to "https://my-app.com/app.js".
    const relativeElement: HTMLAnchorElement = document.createElement("a");

    function getCacheBustedUrl(relative: string): string {
        // Determine cache busting version.
        let version = localStorage.getItem("version");
        if (!version) {
            // Because this is the first time we are loading the app, it can't be cached, so we can use any version number.
            // In this case we use milliseconds elapsed between 1970-1-1 and now.
            version = (new Date()).getTime().toString();
        }
        const relativeAfterSlashStrip = (relative[0] === "/") ? relative.substring(1) : relative;
        // Split url into folder and filename, so we can inject cache busting version.
        const startsWithADot = (relativeAfterSlashStrip[0] === ".");
        // If relative does not start with a ".", module is located in "node_modules" folder.
        const relativeAfterNodeCheck = startsWithADot ? relativeAfterSlashStrip : "./node_modules/" + relativeAfterSlashStrip;
        const lastIndexOfSlash = relativeAfterNodeCheck.lastIndexOf("/");
        const constainsSlash = (lastIndexOfSlash > -1);
        const filename = constainsSlash ? relativeAfterNodeCheck.substring(lastIndexOfSlash + 1) : relativeAfterNodeCheck;
        const rawFolder = constainsSlash ? relativeAfterNodeCheck.substring(0, lastIndexOfSlash) : "/";
        const folder = (rawFolder[0] === "/") ? rawFolder.substring(1) : rawFolder;
        const cacheBustedUrl = folder + "/v-" + version + "/" + filename;
        return cacheBustedUrl;
    }

    // Loads the given module and all of it dependencies, recursively
    // - module         The module object
    // - callback       Called when everything has been loaded
    // - parentLocation Location of the parent directory to look in. Only given
    // for non-relative dependencies
    // - id             The name of the dependency. Only used for non-relative
    // dependencies
    function deepLoad(moduleInfo: ModuleInfo, callback: any, parentLocation?: any, id?: any) {
        // If this module is already loading then don't proceed.
        // This is a bug.
        // If a module is requested but not loaded then the module isn't ready,
        // but we callback as if it is. Oh well, 1k!
        if (moduleInfo.g) {
            return callback(moduleInfo.e, moduleInfo);
        }

        const location = moduleInfo.g = moduleInfo.l;

        const request = new XMLHttpRequest();
        request.onload = function (): any {

            if (request.status === 200 || moduleInfo.t) {
                // Should really use an object and then Object.keys to avoid
                // duplicate dependencies. But that costs bytes.
                const deps: string[] = [];

                // The regex contains a bug, it will also load "dynamic" dependencies direct.
                // In TypeScript, const mod = await import("./common/my-mod");
                // Will "compile" to:
                // const mod = yield Promise.resolve().then(() => require("./common/my-mod"));
                // Which will be found by the regex.
                (moduleInfo.t = moduleInfo.t || request.response).replace(/(?:^|[^\w\$_.])require\s*\(\s*["']([^"']*)["']\s*\)/g,
                    function (_: string, id: string) {
                        deps.push(id);
                    }
                );

                let count = deps.length;

                // Function declarations are not allowed inside blocks in strict mode when targeting 'ES3' or 'ES5'. So we use a variable.
                const loaded = function () {
                    // We call loaded straight away below in case there
                    // are no dependencies. Putting this check first
                    // and the decrement after saves us an `if` for that
                    // special case
                    if (!count--) {
                        callback(undefined, moduleInfo);
                    }
                };

                deps.map(function (dep: string) {
                    deepLoad(
                        resolveModuleOrGetExports(moduleInfo.l, dep),
                        loaded,
                        // If it doesn't begin with a ".", then we're searching
                        // node_modules, so pass in the info to make this
                        // possible
                        dep[0] !== "." ? location + "/../" : undefined,
                        dep
                    );
                });
                loaded();
            } else {
                // parentLocation is only given if we're searching in node_modules
                if (parentLocation) {
                    // Recurse up the tree trying to find the dependency
                    // (generating 404s on the way)
                    deepLoad(
                        moduleInfo.n = resolveModuleOrGetExports(parentLocation += "../", id),
                        callback,
                        parentLocation,
                        id
                    );
                } else {
                    moduleInfo.e = request;
                    callback(request, moduleInfo);
                }
            }
        };

        // If the module already has text because we're using a factory
        // function, then there's no need to load the file!
        if (moduleInfo.t) {
            request.onload(null);
        } else {
            console.log(`HTTP GET [${location}]`);
            request.open("GET", location, true);
            request.send();
        }
    }

    /**
     * 
     * @param relative
     * @param fileExtension - e.g. ".css" or ".js"
     * @param base
     */
    function resolve(relative: string, fileExtension: string, base?: string): string {
        baseElement.href = base || "";
        // If the relative url doesn't begin with a ".", then it's in node_modules
        const cacheBustedUrl: string = getCacheBustedUrl(relative);
        relativeElement.href = cacheBustedUrl;

        const resolved = relativeElement.href + fileExtension;
        baseElement.href = "";

        return resolved;
    }

    // Save bytes by combining two functions
    // - resolveModule which resolves a given relative path against the given
    //   base, and returns an existing or new module object
    // - getExports which returns the existing exports or runs the factory to
    //   create the exports for a module
    function resolveModuleOrGetExports(baseOrModule: any, relative?: any, resolved?: any): any {
        // This should really be after the relative check, but because we are
        // `throw`ing, it messes up the optimizations. If we are being called
        // as resolveModule then the string `base` won't have the `e` property,
        // so we're fine.
        if (baseOrModule.e) {
            throw baseOrModule.e;
        }

        // If 2 arguments are given, then we are resolving modules...
        if (relative) {
            resolved = resolve(relative, ".js", baseOrModule);

            return (MODULES[resolved] = MODULES[resolved] || { l: resolved });
        }

        // ...otherwise we are getting the exports

        // Is this module a redirect to another one?
        if (baseOrModule.n) {
            return resolveModuleOrGetExports(baseOrModule.n);
        }

        if (!baseOrModule["exports"]) {
            // Wrap the text of a loaded module in a function that takes the following parameters:
            // - require: function - Is needed by nodejs modules.
            // - exports: 
            // - module:
            // Then execute this function.
            console.log(`Evaluating module [${baseOrModule.l}].`);
            (baseOrModule.f || globalEval("(function(require, " + "exports" + ", module){" + baseOrModule.t + "\n})//# sourceURL=" + baseOrModule.l))(
                // The require function will be called by a module to load dependencies.
                // Parameter "path", will be the unresolved path to a dependent module.s
                function require(path: string) {
                    return resolveModuleOrGetExports(resolveModuleOrGetExports(baseOrModule.l, path));
                }, // require
                baseOrModule["exports"] = {}, // exports
                baseOrModule // module
            );
        }

        return baseOrModule["exports"];
    }

    export function requireCss(relative: string, callback?: () => void): void {

        // Convert the given url, to the correct cache busted url.
        const href = resolve(relative, ".css");

        // Only load stylesheet once.
        if (!stylesheets[href]) {
            stylesheets[href] = href;

            // Load stylesheet by adding a "link" tag to the head of the document.
            const link: HTMLLinkElement = document.createElement("link");
            link.href = resolve(relative, ".css");
            link.rel = "stylesheet";
            link.type = "text/css";
            headElement.appendChild(link);

            if (callback) {
                callback();
            }
        }
    }

    export function requireJS(id: string, callback?: any): void {
       
        deepLoad(resolveModuleOrGetExports("", id), function (err: any, module: any): any {
            try {
                id = resolveModuleOrGetExports(module);
            } catch (_err) {
                err = _err;
            }
            if (callback) {
                callback(err, id);
            }
            if (err) {
                throw err;
            }
        });
    }

    // When this file is loaded, it will automatically start the module load process here.
    // The module loading process is started by finding the first "script" tag with a custom data attribute "data-main".
    // The value of the custom data attribute "data-main" will be used to load the first module.
    const scriptElement = <HTMLScriptElement>document.querySelector("script[data-main]");
    if (scriptElement) {

        // Get path to the first module to load.
        const path: string = scriptElement.dataset.main;
        requireJS(path);
    }

    interface ModuleInfo {
        e?: any;         // booleany - Error, truthy if there was an error (probably a 404) loading the module
        exports?: any;   // object   - The exports of the module!
        f?: any;         // function - Factory, a function to use instead of eval'ing module.t
        g?: any;         // booleany - LoadinG, truthy if this module has been requested for loading before. Used to prevent the same module being loaded twice
        l?: any;         // string   - Location, the url location of this module
        n?: any;         // object   - Module object, Next, instead of using this module, use the object pointed to by this property. Used for dependencies in other packages
        t?: string;      // string   - Text, the text content of the module
    }

    type StylesheetIndex = {
        [key: string]: string
    };

    type DependencyIndex = {
        [key: string]: string
    };

    // The "key" of each entry, will be the "absolute path" to the module e.g. https://my-app.com/app
    // The "value" of each entry,  will be a "ModuleInfo" object.
    type ModuleInfoIndex = {
        [key: string]: ModuleInfo
    };
}