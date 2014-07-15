;<?php die('This is not a program file.'); exit; ?>

_detailPage = ""
_disableAdd = 0
_disableErase = 0
_disableModify = 0
_disableView = 1
_filenameFields = "jobNum"
_hideRecordsFromDisabledAccounts = 0
_indent = 0
_listPage = ""
_maxRecords = ""
_maxRecordsPerUser = ""
_previewPage = ""
_requiredPlugins = ""
listPageFields = "jobNum, rowNum, colNum, colValue"
listPageOrder = "jobNum DESC, rowNum, colNum"
listPageSearchFields = "_all_"
menuHidden = 1
menuName = "CSV Import Data"
menuOrder = 25
menuType = "multi"

[jobNum]
customColumnType = "INT NOT NULL"
order = 2
label = "jobNum"
type = "textfield"
defaultValue = ""
fieldPrefix = ""
description = ""
fieldWidth = ""
isPasswordField = 0
isRequired = 0
isUnique = 0
minLength = ""
maxLength = ""
charsetRule = ""
charset = ""

[rowNum]
customColumnType = "INT NOT NULL"
order = 3
label = "rowNum"
type = "textfield"
defaultValue = ""
fieldPrefix = ""
description = ""
fieldWidth = ""
isPasswordField = 0
isRequired = 0
isUnique = 0
minLength = ""
maxLength = ""
charsetRule = ""
charset = ""

[colNum]
customColumnType = "INT NOT NULL"
order = 4
label = "colNum"
type = "textfield"
defaultValue = ""
fieldPrefix = ""
description = ""
fieldWidth = ""
isPasswordField = 0
isRequired = 0
isUnique = 0
minLength = ""
maxLength = ""
charsetRule = ""
charset = ""

[colValue]
order = 5
label = "colValue"
type = "textbox"
defaultContent = ""
fieldPrefix = ""
description = ""
isRequired = 0
isUnique = 0
minLength = ""
maxLength = ""
fieldHeight = 200
autoFormat = 0
