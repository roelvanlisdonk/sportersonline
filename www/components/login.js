"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("../store");
const button_1 = require("./button");
const input_1 = require("./input");
function login(account) {
    return __awaiter(this, void 0, void 0, function* () {
        function inloggen(evt) {
            console.log("Inloggen!!!");
            account.isAuthenticated.value = true;
            store_1.saveField(account.isAuthenticated);
        }
        const node = {
            deps: account,
            nodes: [
                { text: "Gebruikersnaam" },
                input_1.input(account.name),
                { text: "Wachtwoord" },
                input_1.input(account.password),
                button_1.button({ onClick: inloggen, text: "Inloggen" })
            ],
            name: "login"
        };
        return node;
    });
}
exports.login = login;
//# sourceMappingURL=login.js.map