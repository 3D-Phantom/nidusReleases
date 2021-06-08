"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmInstallRPackagesDetails = exports.confirmInstallPythonPackagesDetails = exports.confirmInstallPythonPackages = exports.externalScriptsIsRequiredError = exports.enableExternalScriptsError = exports.confirmEnableExternalScripts = exports.requiredPackagesNotInstalled = exports.noResultError = exports.installModelMngDependenciesMsgTaskName = exports.installPackageMngDependenciesMsgTaskName = exports.cannotFindR = exports.cannotFindPython = exports.taskFailedError = exports.verifyOdbcDriverError = exports.notebookExtensionFailedError = exports.managePackageCommandError = exports.msgNo = exports.msgYes = exports.varcharDefaultLength = exports.varcharMax = exports.supportedDataTypes = exports.adsPythonBundleVersion = exports.rPathConfigKey = exports.registeredModelsTableName = exports.rEnabledConfigKey = exports.pythonEnabledConfigKey = exports.pythonPathConfigKey = exports.mlsConfigKey = exports.notebookCommandNew = exports.mlsEnableExternalScriptCommand = exports.mlsDependenciesCommand = exports.mlManagePackagesCommand = exports.mlImportModelCommand = exports.mlManageModelsCommand = exports.mlsPredictModelCommand = exports.mlManageLanguagesCommand = exports.signInToAzureCommand = exports.azureResourceGroupsCommand = exports.azureSubscriptionsCommand = exports.notebookExtensionName = exports.extensionOutputChannel = exports.mlDisableMlsCommand = exports.mlEnableMlsCommand = exports.supportedODBCDriver = exports.rLPackagedFolderName = exports.rLanguageName = exports.pythonLanguageName = exports.managePackagesCommand = exports.pythonBundleVersion = exports.winPlatform = void 0;
exports.extLangEnvVariables = exports.extLangExtensionFileName = exports.extLangExtensionFileLocation = exports.extLangExtensionFilePath = exports.extLangLocal = exports.extLangTarget = exports.extLangDialogTitle = exports.extLangFileBrowserTabTitle = exports.extLangNewLanguageTabTitle = exports.extLangLanguageName = exports.extLangSaveButtonText = exports.extLangOkButtonText = exports.extLangDoneButtonText = exports.extLangCancelButtonText = exports.extLangInstallButtonText = exports.editTitle = exports.deleteTitle = exports.extLangLanguagePlatform = exports.extLangLanguageCreatedDate = exports.extLangInstallTabTitle = exports.notSupportedEventArg = exports.getErrorMessage = exports.httpGetRequestError = exports.localhost = exports.latestVersion = exports.resourceNotFoundError = exports.installingDependencies = exports.rConfigError = exports.pythonConfigError = exports.downloadingProgress = exports.noArtifactError = exports.invalidModelIdError = exports.downloadError = exports.mlsRLanguageTitle = exports.mlsPythonLanguageTitle = exports.mlsExternalExecuteScriptTitle = exports.mlsConfigAction = exports.mlsConfigStatus = exports.mlsConfigTitle = exports.mlsDisableButtonTitle = exports.mlsEnableButtonTitle = exports.mlsConfigUpdateFailed = exports.mlsEnabledMessage = exports.mssqlExtensionNotLoaded = exports.notebookExtensionNotLoaded = exports.noConnectionError = exports.installDependenciesGetPackagesError = exports.installDependenciesPackagesAlreadyInstalled = exports.installDependenciesPackages = exports.confirmDeleteModel = void 0;
exports.azureModelFilter = exports.azureModelWorkspace = exports.azureGroup = exports.azureSubscription = exports.outputName = exports.selectTableTitle = exports.selectDatabaseTitle = exports.selectModelTableTitle = exports.selectModelDatabaseTitle = exports.selectColumnTitle = exports.inputName = exports.displayName = exports.dataTypeName = exports.columnName = exports.outputColumns = exports.inputColumns = exports.columnTableInfo = exports.columnTable = exports.columnDatabaseInfo = exports.columnDatabase = exports.azureSignIn = exports.azureAccount = exports.browseModels = exports.modelVersion = exports.modelFrameworkVersion = exports.modelFramework = exports.modelImported = exports.modelCreated = exports.modelDescription = exports.modelFileName = exports.modelName = exports.newTableName = exports.existingTableName = exports.modelDatabaseInfo = exports.modelTableInfo = exports.tableName = exports.tableToStoreInfo = exports.databaseToStoreInfo = exports.databaseName = exports.modelsListEmptyDescription = exports.azureModelsListEmptyDescription = exports.azureModelsListEmptyTitle = exports.selectModelDatabaseMessage = exports.selectModelTableMessage = exports.modelsListEmptyMessage = exports.modelUpdateFailedError = exports.extLangUpdateFailedError = exports.extLangInstallFailedError = exports.extLangSelectedPath = exports.extLangParameters = void 0;
exports.columnDataTypeMismatchWarning = exports.columnDataTypeMismatchWarningHeading = exports.columnDataTypeMismatchWarningHelper = exports.invalidModelImportTargetError = exports.invalidModelToSelectError = exports.invalidModelParametersError = exports.invalidModelToPredictError = exports.invalidModelToRegisterError = exports.invalidAzureResourceError = exports.downloadModelMsgTaskName = exports.registeredModelsSource = exports.importedModelsPageTitle = exports.azureModelPageTitle = exports.azureModelSource = exports.localModelPageTitle = exports.localModelSource = exports.modelFailedToRegister = exports.modelUpdatedSuccessfully = exports.modelRegisteredSuccessfully = exports.createNotebookDesc = exports.createNotebookTitle = exports.makePredictionDesc = exports.makePredictionTitle = exports.importModelDesc = exports.editModelTitle = exports.importModelTitle = exports.learnMoreLink = exports.viewImportModeledForPredictDesc = exports.viewImportModelsDesc = exports.viewImportModelsTitle = exports.registerModelTitle = exports.predictModel = exports.importModelDoneButton = exports.currentModelsTitle = exports.onnxNotSupportedError = exports.modelLocalSourceTooltip = exports.modelLocalSourceTitle = exports.modelDetailsPageTitle = exports.columnSelectionPageTitle = exports.modelImportTargetPageTitle = exports.azureModelSourceDescriptionForPredict = exports.importedModelSourceDescriptionForPredict = exports.localModelSourceDescriptionForPredict = exports.azureModelSourceDescriptionForImport = exports.localModelSourceDescriptionForImport = exports.modelSourcePageTitle = exports.modelSourcesTitle = exports.localModelsTitle = exports.azureModelsTitle = exports.azureModels = void 0;
exports.cssStyles = exports.importModelsDoc = exports.managePackagesDocs = exports.onnxOnEdgeDocs = exports.mlsMIDocLink = exports.mlsDocLink = exports.mlExtDocLink = exports.mlDocLink = exports.odbcDriverDocuments = exports.getDataCount = exports.onnxOnEdgeOdbcDocDesc = exports.onnxOnEdgeOdbcDocTitle = exports.mlsInstallOdbcDocDesc = exports.mlsInstallOdbcDocTitle = exports.sqlMlsMIDocDesc = exports.sqlMlsMIDocTitle = exports.sqlMlsDocDesc = exports.sqlMlsDocTitle = exports.sqlMlDocDesc = exports.sqlMlExtDocDesc = exports.sqlMlExtDocTitle = exports.sqlMlDocTitle = exports.learnMoreTitle = exports.showLessTitle = exports.showMoreTitle = exports.dashboardVideoLinksTitle = exports.dashboardLinksTitle = exports.dashboardDesc = exports.dashboardTitle = exports.unsupportedModelParameterType = exports.loadModelParameterFailedError = exports.invalidImportTableSchemaError = exports.invalidImportTableError = exports.importModelFailedError = exports.modelSchemaIsNotAcceptedMessage = exports.selectModelsTableMessage = exports.modelSchemaIsAcceptedMessage = exports.updateModelFailedError = exports.modelsRequiredError = exports.modelNameRequiredError = exports.outputColumnDataTypeNotSupportedWarning = void 0;
const nls = require("vscode-nls");
const localize = nls.loadMessageBundle();
exports.winPlatform = 'win32';
exports.pythonBundleVersion = '0.0.1';
exports.managePackagesCommand = 'jupyter.cmd.managePackages';
exports.pythonLanguageName = 'Python';
exports.rLanguageName = 'R';
exports.rLPackagedFolderName = 'r_packages';
exports.supportedODBCDriver = 'ODBC Driver 17 for SQL Server';
exports.mlEnableMlsCommand = 'ml.command.enableMls';
exports.mlDisableMlsCommand = 'ml.command.disableMls';
exports.extensionOutputChannel = 'Machine Learning';
exports.notebookExtensionName = 'Microsoft.notebook';
exports.azureSubscriptionsCommand = 'azure.accounts.getSubscriptions';
exports.azureResourceGroupsCommand = 'azure.accounts.getResourceGroups';
exports.signInToAzureCommand = 'azure.resource.signin';
// Tasks, commands
//
exports.mlManageLanguagesCommand = 'ml.command.manageLanguages';
exports.mlsPredictModelCommand = 'ml.command.predictModel';
exports.mlManageModelsCommand = 'ml.command.manageModels';
exports.mlImportModelCommand = 'ml.command.importModel';
exports.mlManagePackagesCommand = 'ml.command.managePackages';
exports.mlsDependenciesCommand = 'ml.command.dependencies';
exports.mlsEnableExternalScriptCommand = 'ml.command.enableExternalScript';
exports.notebookCommandNew = 'notebook.command.new';
// Configurations
//
exports.mlsConfigKey = 'machineLearning';
exports.pythonPathConfigKey = 'pythonPath';
exports.pythonEnabledConfigKey = 'enablePython';
exports.rEnabledConfigKey = 'enableR';
exports.registeredModelsTableName = 'registeredModelsTableName';
exports.rPathConfigKey = 'rPath';
exports.adsPythonBundleVersion = '0.0.1';
// TSQL
//
// The data types that are supported to convert model's parameters to SQL data
exports.supportedDataTypes = [
    'BIGINT',
    'INT',
    'SMALLINT',
    'REAL',
    'FLOAT',
    'VARCHAR(MAX)',
    'BIT'
];
exports.varcharMax = 'VARCHAR(MAX)';
exports.varcharDefaultLength = 100;
// Localized texts
//
exports.msgYes = localize('msgYes', "Yes");
exports.msgNo = localize('msgNo', "No");
exports.managePackageCommandError = localize('mls.managePackages.error', "Package management is not supported for the server. Make sure you have Python or R installed.");
exports.notebookExtensionFailedError = localize('notebookExtensionFailedError', "The extension failed to load because of it's dependency to Notebook extension. Please check the output log for Notebook extension to get more details");
exports.verifyOdbcDriverError = localize('mls.verifyOdbcDriverError.error', "'{0}' is required  for package management. Please make sure it is installed and set up correctly.", exports.supportedODBCDriver);
function taskFailedError(taskName, err) { return localize('mls.taskFailedError.error', "Failed to complete task '{0}'. Error: {1}", taskName, err); }
exports.taskFailedError = taskFailedError;
function cannotFindPython(path) { return localize('mls.cannotFindPython.error', "Cannot find Python executable '{0}'. Please make sure Python is installed and configured correctly", path); }
exports.cannotFindPython = cannotFindPython;
function cannotFindR(path) { return localize('mls.cannotFindR.error', "Cannot find R executable '{0}'. Please make sure R is installed and configured correctly", path); }
exports.cannotFindR = cannotFindR;
exports.installPackageMngDependenciesMsgTaskName = localize('mls.installPackageMngDependencies.msgTaskName', "Verifying package management dependencies");
exports.installModelMngDependenciesMsgTaskName = localize('mls.installModelMngDependencies.msgTaskName', "Verifying model management dependencies");
exports.noResultError = localize('mls.noResultError', "No Result returned");
exports.requiredPackagesNotInstalled = localize('mls.requiredPackagesNotInstalled', "The required packages are not installed");
exports.confirmEnableExternalScripts = localize('mls.confirmEnableExternalScripts', "External script is required for package management. Are you sure you want to enable that.");
exports.enableExternalScriptsError = localize('mls.enableExternalScriptsError', "Failed to enable External script.");
exports.externalScriptsIsRequiredError = localize('mls.externalScriptsIsRequiredError', "External script configuration is required for this action.");
exports.confirmInstallPythonPackages = localize('mls.confirmInstallPythonPackages', "Are you sure you want to install required packages?");
function confirmInstallPythonPackagesDetails(packages) {
    return localize('mls.installDependencies.confirmInstallPythonPackages', "The following Python packages are required to install: {0}", packages);
}
exports.confirmInstallPythonPackagesDetails = confirmInstallPythonPackagesDetails;
function confirmInstallRPackagesDetails(packages) {
    return localize('mls.installDependencies.confirmInstallRPackages', "The following R packages are required to install: {0}", packages);
}
exports.confirmInstallRPackagesDetails = confirmInstallRPackagesDetails;
function confirmDeleteModel(modelName) {
    return localize('models.confirmDeleteModel', "Are you sure you want to delete model '{0}?", modelName);
}
exports.confirmDeleteModel = confirmDeleteModel;
exports.installDependenciesPackages = localize('mls.installDependencies.packages', "Installing required packages ...");
exports.installDependenciesPackagesAlreadyInstalled = localize('mls.installDependencies.packagesAlreadyInstalled', "Required packages are already installed.");
function installDependenciesGetPackagesError(err) { return localize('mls.installDependencies.getPackagesError', "Failed to get installed python packages. Error: {0}", err); }
exports.installDependenciesGetPackagesError = installDependenciesGetPackagesError;
exports.noConnectionError = localize('mls.packageManager.NoConnection', "No connection selected");
exports.notebookExtensionNotLoaded = localize('mls.notebookExtensionNotLoaded', "Notebook extension is not loaded");
exports.mssqlExtensionNotLoaded = localize('mls.mssqlExtensionNotLoaded', "MSSQL extension is not loaded");
exports.mlsEnabledMessage = localize('mls.enabledMessage', "Machine Learning Services Enabled");
exports.mlsConfigUpdateFailed = localize('mls.configUpdateFailed', "Failed to modify Machine Learning Services configurations");
exports.mlsEnableButtonTitle = localize('mls.enableButtonTitle', "Enable");
exports.mlsDisableButtonTitle = localize('mls.disableButtonTitle', "Disable");
exports.mlsConfigTitle = localize('mls.configTitle', "Config");
exports.mlsConfigStatus = localize('mls.configStatus', "Enabled");
exports.mlsConfigAction = localize('mls.configAction', "Action");
exports.mlsExternalExecuteScriptTitle = localize('mls.externalExecuteScriptTitle', "External Execute Script");
exports.mlsPythonLanguageTitle = localize('mls.pythonLanguageTitle', "Python");
exports.mlsRLanguageTitle = localize('mls.rLanguageTitle', "R");
exports.downloadError = localize('mls.downloadError', "Error while downloading");
function invalidModelIdError(modelUrl) { return localize('mls.invalidModelIdError', "Invalid model id. model url: {0}", modelUrl || ''); }
exports.invalidModelIdError = invalidModelIdError;
function noArtifactError(modelUrl) { return localize('mls.noArtifactError', "Model doesn't have any artifact. model url: {0}", modelUrl || ''); }
exports.noArtifactError = noArtifactError;
exports.downloadingProgress = localize('mls.downloadingProgress', "Downloading");
exports.pythonConfigError = localize('mls.pythonConfigError', "Python executable is not configured");
exports.rConfigError = localize('mls.rConfigError', "R executable is not configured");
exports.installingDependencies = localize('mls.installingDependencies', "Installing dependencies ...");
exports.resourceNotFoundError = localize('mls.resourceNotFound', "Could not find the specified resource");
exports.latestVersion = localize('mls.latestVersion', "Latest");
exports.localhost = 'localhost';
function httpGetRequestError(code, message) {
    return localize('mls.httpGetRequestError', "Package info request failed with error: {0} {1}", code, message);
}
exports.httpGetRequestError = httpGetRequestError;
function getErrorMessage(error) { return localize('azure.resource.error', "Error: {0}", (error === null || error === void 0 ? void 0 : error.message) || (error === null || error === void 0 ? void 0 : error.toString())); }
exports.getErrorMessage = getErrorMessage;
exports.notSupportedEventArg = localize('notSupportedEventArg', "Not supported event args");
exports.extLangInstallTabTitle = localize('extLang.installTabTitle', "Installed");
exports.extLangLanguageCreatedDate = localize('extLang.languageCreatedDate', "Installed");
exports.extLangLanguagePlatform = localize('extLang.languagePlatform', "Platform");
exports.deleteTitle = localize('extLang.delete', "Delete");
exports.editTitle = localize('editTitle', "Edit");
exports.extLangInstallButtonText = localize('extLang.installButtonText', "Install");
exports.extLangCancelButtonText = localize('extLang.CancelButtonText', "Cancel");
exports.extLangDoneButtonText = localize('extLang.DoneButtonText', "Close");
exports.extLangOkButtonText = localize('extLang.OkButtonText', "OK");
exports.extLangSaveButtonText = localize('extLang.SaveButtonText', "Save");
exports.extLangLanguageName = localize('extLang.languageName', "Name");
exports.extLangNewLanguageTabTitle = localize('extLang.newLanguageTabTitle', "Add new");
exports.extLangFileBrowserTabTitle = localize('extLang.fileBrowserTabTitle', "File Browser");
exports.extLangDialogTitle = localize('extLang.DialogTitle', "Languages");
exports.extLangTarget = localize('extLang.Target', "Target");
exports.extLangLocal = localize('extLang.Local', "localhost");
exports.extLangExtensionFilePath = localize('extLang.extensionFilePath', "Language extension path");
exports.extLangExtensionFileLocation = localize('extLang.extensionFileLocation', "Language extension location");
exports.extLangExtensionFileName = localize('extLang.extensionFileName', "Extension file Name");
exports.extLangEnvVariables = localize('extLang.envVariables', "Environment variables");
exports.extLangParameters = localize('extLang.parameters', "Parameters");
exports.extLangSelectedPath = localize('extLang.selectedPath', "Selected Path");
exports.extLangInstallFailedError = localize('extLang.installFailedError', "Failed to install language");
exports.extLangUpdateFailedError = localize('extLang.updateFailedError', "Failed to update language");
exports.modelUpdateFailedError = localize('models.modelUpdateFailedError', "Failed to update the model");
exports.modelsListEmptyMessage = localize('models.modelsListEmptyMessage', "No models found");
exports.selectModelTableMessage = localize('models.selectModelTableMessage', "Select table");
exports.selectModelDatabaseMessage = localize('models.selectModelDatabaseMessage', "Select Database");
exports.azureModelsListEmptyTitle = localize('models.azureModelsListEmptyTitle', "No models found");
exports.azureModelsListEmptyDescription = localize('models.azureModelsListEmptyDescription', "Select another Azure ML workspace");
exports.modelsListEmptyDescription = localize('models.modelsListEmptyDescription', "Select another database or table");
exports.databaseName = localize('databaseName', "Database");
exports.databaseToStoreInfo = localize('databaseToStoreInfo', "Select a database to store the new model.");
exports.tableToStoreInfo = localize('tableToStoreInfo', "Select an existing table that conforms the model schema or create a new one to store the imported model.");
exports.tableName = localize('tableName', "Table");
exports.modelTableInfo = localize('modelTableInfo', "Select a model table to view the list of existing / imported models.");
exports.modelDatabaseInfo = localize('modelDatabaseInfo', "Select a database where existing / imported models are stored.");
exports.existingTableName = localize('existingTableName', "Existing table");
exports.newTableName = localize('newTableName', "New table");
exports.modelName = localize('models.name', "Name");
exports.modelFileName = localize('models.fileName', "File");
exports.modelDescription = localize('models.description', "Description");
exports.modelCreated = localize('models.created', "Date created");
exports.modelImported = localize('models.imported', "Date imported");
exports.modelFramework = localize('models.framework', "Framework");
exports.modelFrameworkVersion = localize('models.frameworkVersion', "Framework version");
exports.modelVersion = localize('models.version', "Version");
exports.browseModels = localize('models.browseButton', "...");
exports.azureAccount = localize('models.azureAccount', "Azure account");
exports.azureSignIn = localize('models.azureSignIn', "Azure sign in or refresh account");
exports.columnDatabase = localize('predict.columnDatabase', "Source database");
exports.columnDatabaseInfo = localize('predict.columnDatabaseInfo', "Select the database containing the dataset to apply the prediction.");
exports.columnTable = localize('predict.columnTable', "Source table");
exports.columnTableInfo = localize('predict.columnTableInfo', "Select the table containing the dataset to apply the prediction.");
exports.inputColumns = localize('predict.inputColumns', "Model Input mapping");
exports.outputColumns = localize('predict.outputColumns', "Model output");
exports.columnName = localize('predict.columnName', "Source columns");
exports.dataTypeName = localize('predict.dataTypeName', "Type");
exports.displayName = localize('predict.displayName', "Display  name");
exports.inputName = localize('predict.inputName', "Model input");
exports.selectColumnTitle = localize('predict.selectColumnTitle', "Select column...");
exports.selectModelDatabaseTitle = localize('models.selectModelDatabaseTitle', "Select database with models");
exports.selectModelTableTitle = localize('models.selectModelTableTitle', "Select tables with models");
exports.selectDatabaseTitle = localize('predict.selectDatabaseTitle', "Select database");
exports.selectTableTitle = localize('predict.selectTableTitle', "Select table");
exports.outputName = localize('predict.outputName', "Name");
exports.azureSubscription = localize('models.azureSubscription', "Azure subscription");
exports.azureGroup = localize('models.azureGroup', "Resource group");
exports.azureModelWorkspace = localize('models.azureModelWorkspace', "Azure ML workspace");
exports.azureModelFilter = localize('models.azureModelFilter', "Filter");
exports.azureModels = localize('models.azureModels', "Models");
exports.azureModelsTitle = localize('models.azureModelsTitle', "Azure models");
exports.localModelsTitle = localize('models.localModelsTitle', "Local models");
exports.modelSourcesTitle = localize('models.modelSourcesTitle', "Source location");
exports.modelSourcePageTitle = localize('models.modelSourcePageTitle', "Select model source type");
exports.localModelSourceDescriptionForImport = localize('models.localModelSourceDescriptionForImport', "‘File Upload’ is selected. This allows you to import a model file from your local machine into a model database in this SQL instance. Click ‘Next’ to continue.​");
exports.azureModelSourceDescriptionForImport = localize('models.azureModelSourceDescriptionForImport', "‘Azure Machine Learning’ is selected. This allows you to import models stored in Azure Machine Learning workspaces in a model database in this SQL instance. Click ‘Next’ to continue.​​");
exports.localModelSourceDescriptionForPredict = localize('models.localModelSourceDescriptionForPredict', "‘File Upload’ is selected. This allows you to upload a model file from your local machine.  Click ‘Next’ to continue.​​");
exports.importedModelSourceDescriptionForPredict = localize('models.importedModelSourceDescriptionForPredict', "‘Imported Models’ is selected. This allows you to choose from models stored in a model table in your database.  Click ‘Next’ to continue.​");
exports.azureModelSourceDescriptionForPredict = localize('models.azureModelSourceDescriptionForPredict', "‘Azure Machine Learning’ is selected. This allows you to choose from models stored in Azure Machine Learning workspaces. Click ‘Next’ to continue.​");
exports.modelImportTargetPageTitle = localize('models.modelImportTargetPageTitle', "Select or enter the location to import the models to");
exports.columnSelectionPageTitle = localize('models.columnSelectionPageTitle', "Map source data to model");
exports.modelDetailsPageTitle = localize('models.modelDetailsPageTitle', "Enter model details");
exports.modelLocalSourceTitle = localize('models.modelLocalSourceTitle', "Source files");
exports.modelLocalSourceTooltip = localize('models.modelLocalSourceTooltip', "File paths of the models to import");
exports.onnxNotSupportedError = localize('models.onnxNotSupportedError', "ONNX runtime is not supported in current server");
exports.currentModelsTitle = localize('models.currentModelsTitle', "Models");
exports.importModelDoneButton = localize('models.importModelDoneButton', "Import");
exports.predictModel = localize('models.predictModel', "Predict");
exports.registerModelTitle = localize('models.RegisterWizard', "Import models");
exports.viewImportModelsTitle = localize('models.viewImportModelsTitle', "View and import models");
exports.viewImportModelsDesc = localize('models.viewImportModelsDesc', "Machine Learning models can be stored in one or more databases and tables. Select the model database and table to view the models within them.");
exports.viewImportModeledForPredictDesc = localize('models.viewImportModeledForPredictDesc', "The models are stored in one or more databases and tables. Select the model database and table to view models in them.");
exports.learnMoreLink = localize('models.learnMoreLink', "Learn more.");
exports.importModelTitle = localize('models.importModelTitle', "Import or view models");
exports.editModelTitle = localize('models.editModelTitle', "Edit model");
exports.importModelDesc = localize('models.importModelDesc', "Import or view machine learning models stored in database");
exports.makePredictionTitle = localize('models.makePredictionTitle', "Make predictions");
exports.makePredictionDesc = localize('models.makePredictionDesc', "Generate a predicted value or scores using a managed model");
exports.createNotebookTitle = localize('models.createNotebookTitle', "Create notebook");
exports.createNotebookDesc = localize('models.createNotebookDesc', "Run experiments and create models in a notebook");
exports.modelRegisteredSuccessfully = localize('models.modelRegisteredSuccessfully', "Model registered successfully");
exports.modelUpdatedSuccessfully = localize('models.modelUpdatedSuccessfully', "Model updated successfully");
exports.modelFailedToRegister = localize('models.modelFailedToRegistered', "Model failed to register");
exports.localModelSource = localize('models.localModelSource', "File upload");
exports.localModelPageTitle = localize('models.localModelPageTitle', "Upload model file");
exports.azureModelSource = localize('models.azureModelSource', "Azure Machine Learning");
exports.azureModelPageTitle = localize('models.azureModelPageTitle', "Import from Azure Machine Learning");
exports.importedModelsPageTitle = localize('models.importedModelsPageTitle', "Select imported model");
exports.registeredModelsSource = localize('models.registeredModelsSource', "Imported models");
exports.downloadModelMsgTaskName = localize('models.downloadModelMsgTaskName', "Downloading Model from Azure");
exports.invalidAzureResourceError = localize('models.invalidAzureResourceError', "Invalid Azure resource");
exports.invalidModelToRegisterError = localize('models.invalidModelToRegisterError', "Invalid model to register");
exports.invalidModelToPredictError = localize('models.invalidModelToPredictError', "Invalid model to predict");
exports.invalidModelParametersError = localize('models.invalidModelParametersError', "Please select valid source table and model parameters");
exports.invalidModelToSelectError = localize('models.invalidModelToSelectError', "Please select a valid model");
exports.invalidModelImportTargetError = localize('models.invalidModelImportTargetError', "Please select a valid table");
exports.columnDataTypeMismatchWarningHelper = localize('models.columnDataTypeMismatchWarningHelper', "Click to review warning details");
exports.columnDataTypeMismatchWarningHeading = localize('models.columnDataTypeMismatchWarningHeading', "Differences in data type");
exports.columnDataTypeMismatchWarning = localize('models.columnDataTypeMismatchWarning', "The data type of the source table column does not match the required input field’s type.");
exports.outputColumnDataTypeNotSupportedWarning = localize('models.outputColumnDataTypeNotSupportedWarning', "The data type of output column does not match the output field’s type.");
exports.modelNameRequiredError = localize('models.modelNameRequiredError', "Model name is required.");
exports.modelsRequiredError = localize('models.modelsRequiredError', "Please select at least one model to import.");
exports.updateModelFailedError = localize('models.updateModelFailedError', "Failed to update the model");
exports.modelSchemaIsAcceptedMessage = localize('models.modelSchemaIsAcceptedMessage', "Table meets requirements!");
exports.selectModelsTableMessage = localize('models.selectModelsTableMessage', "Select models table");
exports.modelSchemaIsNotAcceptedMessage = localize('models.modelSchemaIsNotAcceptedMessage', "Invalid table structure!");
function importModelFailedError(modelName, filePath) { return localize('models.importModelFailedError', "Failed to register the model: {0} ,file: {1}", modelName || '', filePath || ''); }
exports.importModelFailedError = importModelFailedError;
function invalidImportTableError(databaseName, tableName) { return localize('models.invalidImportTableError', "Invalid table for importing models. database name: {0} ,table name: {1}", databaseName || '', tableName || ''); }
exports.invalidImportTableError = invalidImportTableError;
function invalidImportTableSchemaError(databaseName, tableName) { return localize('models.invalidImportTableSchemaError', "Table schema is not supported for model import. Database name: {0}, table name: {1}.", databaseName || '', tableName || ''); }
exports.invalidImportTableSchemaError = invalidImportTableSchemaError;
exports.loadModelParameterFailedError = localize('models.loadModelParameterFailedError', "Failed to load model parameters'");
exports.unsupportedModelParameterType = localize('models.unsupportedModelParameterType', "unsupported");
exports.dashboardTitle = localize('dashboardTitle', "Machine Learning");
exports.dashboardDesc = localize('dashboardDesc', "Machine Learning for SQL databases");
exports.dashboardLinksTitle = localize('dashboardLinksTitle', "Useful links");
exports.dashboardVideoLinksTitle = localize('dashboardVideoLinksTitle', "Video tutorials");
exports.showMoreTitle = localize('showMoreTitle', "Show more");
exports.showLessTitle = localize('showLessTitle', "Show less");
exports.learnMoreTitle = localize('learnMoreTitle', "Learn more");
exports.sqlMlDocTitle = localize('sqlMlDocTitle', "SQL machine learning documentation");
exports.sqlMlExtDocTitle = localize('sqlMlExtDocTitle', "Machine Learning extension in Azure Data Studio");
exports.sqlMlExtDocDesc = localize('sqlMlExtDocDesc', "Learn how to use Machine Learning extension in Azure Data Studio, to manage packages, make predictions, and import models.");
exports.sqlMlDocDesc = localize('sqlMlDocDesc', "Learn how to use machine learning in SQL Server and SQL on Azure, to run Python and R scripts on relational data.");
exports.sqlMlsDocTitle = localize('sqlMlsDocTitle', "SQL Server Machine Learning Services (Python and R)");
exports.sqlMlsDocDesc = localize('sqlMlsDocDesc', "Get started with Machine Learning Services on SQL Server and how to install it on Windows and Linux.");
exports.sqlMlsMIDocTitle = localize('sqlMlsMIDocTitle', "Machine Learning Services in Azure SQL Managed Instance");
exports.sqlMlsMIDocDesc = localize('sqlMlsMIDocDesc', "Get started with Machine Learning Services in Azure SQL Managed Instances.");
exports.mlsInstallOdbcDocTitle = localize('mlsInstallObdcDocTitle', "Install the Microsoft ODBC driver for SQL Server");
exports.mlsInstallOdbcDocDesc = localize('mlsInstallOdbcDocDesc', "This document explains how to install the Microsoft ODBC Driver for SQL Server.");
exports.onnxOnEdgeOdbcDocTitle = localize('onnxOnEdgeOdbcDocTitle', "Machine learning and AI with ONNX in SQL Database Edge Preview");
exports.onnxOnEdgeOdbcDocDesc = localize('onnxOnEdgeOdbcDocDesc', "Get started with machine learning in Azure SQL Database Edge");
function getDataCount(dataCount) { return localize('ml.dataCount', "Showing {0} model(s)", dataCount); }
exports.getDataCount = getDataCount;
// Links
//
exports.odbcDriverDocuments = 'https://go.microsoft.com/fwlink/?linkid=2129818';
exports.mlDocLink = 'https://go.microsoft.com/fwlink/?linkid=2128671';
exports.mlExtDocLink = 'https://go.microsoft.com/fwlink/?linkid=2129918';
exports.mlsDocLink = 'https://go.microsoft.com/fwlink/?linkid=2128672';
exports.mlsMIDocLink = 'https://go.microsoft.com/fwlink/?linkid=2128673';
exports.onnxOnEdgeDocs = 'https://go.microsoft.com/fwlink/?linkid=2128882';
exports.managePackagesDocs = 'https://go.microsoft.com/fwlink/?linkid=2129919';
exports.importModelsDoc = 'https://go.microsoft.com/fwlink/?linkid=2129796';
// CSS Styles
//
var cssStyles;
(function (cssStyles) {
    cssStyles.title = { 'font-size': '14px', 'font-weight': '600' };
    cssStyles.tableHeader = { 'text-align': 'left', 'font-weight': 'bold', 'text-transform': 'capitalize', 'font-size': '10px', 'user-select': 'text', 'border': 'none', 'border-bottom': '1px solid #ccc' };
    cssStyles.tableRow = { 'border-top': 'solid 1px #ccc', 'border-bottom': 'solid 1px #ccc', 'border-left': 'none', 'border-right': 'none' };
    cssStyles.hyperlink = { 'user-select': 'text', 'color': '#0078d4', 'text-decoration': 'underline', 'cursor': 'pointer' };
    cssStyles.text = { 'margin-block-start': '0px', 'margin-block-end': '0px' };
    cssStyles.overflowEllipsisText = Object.assign(Object.assign({}, cssStyles.text), { 'overflow': 'hidden', 'text-overflow': 'ellipsis' });
    cssStyles.nonSelectableText = Object.assign(Object.assign({}, cssStyles.text), { 'user-select': 'none' });
    cssStyles.tabHeaderText = { 'margin-block-start': '2px', 'margin-block-end': '0px', 'user-select': 'none' };
    cssStyles.selectedResourceHeaderTab = { 'font-weight': 'bold', 'color': '' };
    cssStyles.unselectedResourceHeaderTab = { 'font-weight': '', 'color': '#0078d4' };
    cssStyles.selectedTabDiv = { 'border-bottom': '2px solid #000' };
    cssStyles.unselectedTabDiv = { 'border-bottom': '1px solid #ccc' };
    cssStyles.lastUpdatedText = Object.assign(Object.assign({}, cssStyles.text), { 'color': '#595959' });
    cssStyles.errorText = Object.assign(Object.assign({}, cssStyles.text), { 'color': 'red' });
})(cssStyles = exports.cssStyles || (exports.cssStyles = {}));
//# sourceMappingURL=constants.js.map