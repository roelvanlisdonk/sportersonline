window.addEventListener('unhandledrejection', function handlUnhandledrejection(event) {
    if (console) {
        console.log(event);
    }
});
function start() {
    console.log("start application");
    //render.render();
    const throwError = true;
    later(throwError)
        .then(function handleLater(data) {
        // Don't add catch to test unhandled exceptions
    });
}
function later(throwError) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            if (throwError) {
                throw new Error("Some error occured.");
            }
            resolve("theValue");
        }, 200);
    });
}
start();
//# sourceMappingURL=index.native.js.map