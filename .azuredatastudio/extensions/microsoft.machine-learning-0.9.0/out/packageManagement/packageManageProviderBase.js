"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlPackageManageProviderBase = exports.ScriptMode = void 0;
const utils = require("../common/utils");
var ScriptMode;
(function (ScriptMode) {
    ScriptMode["Install"] = "install";
    ScriptMode["Uninstall"] = "uninstall";
})(ScriptMode = exports.ScriptMode || (exports.ScriptMode = {}));
class SqlPackageManageProviderBase {
    /**
     * Base class for all SQL package managers
     */
    constructor(_apiWrapper) {
        this._apiWrapper = _apiWrapper;
    }
    /**
     * Returns database names
     */
    getLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            if (connection) {
                let databases = yield this._apiWrapper.listDatabases(connection.connectionId);
                return databases.map(x => {
                    return { displayName: x, name: x };
                });
            }
            return [];
        });
    }
    /**
     * Returns database name as current location
     */
    getCurrentLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            let connection = yield this.getCurrentConnection();
            return connection === null || connection === void 0 ? void 0 : connection.databaseName;
        });
    }
    getCurrentConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._apiWrapper.getCurrentConnection();
        });
    }
    /**
     * Installs given packages
     * @param packages Packages to install
     * @param useMinVersion minimum version
     */
    installPackages(packages, useMinVersion, databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (packages) {
                yield Promise.all(packages.map(x => this.installPackage(x, useMinVersion, databaseName)));
            }
            //TODO: use useMinVersion
            console.log(useMinVersion);
        });
    }
    installPackage(packageDetail, useMinVersion, databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (useMinVersion) {
                let packageOverview = yield this.getPackageOverview(packageDetail.name);
                if (packageOverview && packageOverview.versions) {
                    let minVersion = packageOverview.versions[packageOverview.versions.length - 1];
                    packageDetail.version = minVersion;
                }
            }
            yield this.executeScripts(ScriptMode.Install, packageDetail, databaseName);
        });
    }
    /**
     * Uninstalls given packages
     * @param packages Packages to uninstall
     */
    uninstallPackages(packages, databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            let allPackages = yield this.listPackages(databaseName);
            if (packages) {
                yield Promise.all(packages.map(x => {
                    const originalPackage = allPackages.find(p => p.name === x.name && p.version === x.version);
                    if (originalPackage && originalPackage.readonly) {
                        return Promise.reject(`Cannot uninstalled system package '${x.name}'`);
                    }
                    else {
                        return this.executeScripts(ScriptMode.Uninstall, x, databaseName);
                    }
                }));
            }
        });
    }
    /**
     * Returns package overview for given name
     * @param packageName Package Name
     */
    getPackageOverview(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            let packageOverview = yield this.fetchPackage(packageName);
            if (packageOverview && packageOverview.versions) {
                packageOverview.versions = utils.sortPackageVersions(packageOverview.versions, false);
            }
            return packageOverview;
        });
    }
    /**
     * Returns list of packages
     */
    listPackages(databaseName) {
        return __awaiter(this, void 0, void 0, function* () {
            let packages = yield this.fetchPackages(databaseName);
            if (packages) {
                packages = packages.sort((a, b) => this.comparePackages(a, b));
            }
            else {
                packages = [];
            }
            return packages;
        });
    }
    comparePackages(p1, p2) {
        if (p1 && p2) {
            let compare = p1.name.localeCompare(p2.name);
            if (compare === 0) {
                compare = utils.comparePackageVersions(p1.version, p2.version);
            }
            return compare;
        }
        return p1 ? 1 : -1;
    }
}
exports.SqlPackageManageProviderBase = SqlPackageManageProviderBase;
//# sourceMappingURL=packageManageProviderBase.js.map