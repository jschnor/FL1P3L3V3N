;<?php die('This is not a program file.'); exit; ?>

_detailPage = ""
_disableAdd = 0
_disableErase = 0
_disableModify = 0
_disableView = 1
_filenameFields = "num"
_hideRecordsFromDisabledAccounts = 0
_indent = 0
_listPage = ""
_maxRecords = ""
_maxRecordsPerUser = ""
_previewPage = ""
_requiredPlugins = ""
listPageFields = "num, csv_upload, targetTable"
listPageOrder = "num DESC"
listPageSearchFields = "_all_"
menuHidden = 1
menuName = "CSV Import Jobs"
menuOrder = 23
menuType = "multi"

[num]
order = 1
type = "none"
label = "Record Number"
isSystemField = 1

[createdDate]
order = 2
type = "none"
label = "Created"
isSystemField = 1

[createdByUserNum]
order = 3
type = "none"
label = "Created By"
isSystemField = 1

[updatedDate]
order = 4
type = "none"
label = "Last Updated"
isSystemField = 1

[updatedByUserNum]
order = 5
type = "none"
label = "Last Updated By"
isSystemField = 1

[__separator003__]
order = 6
label = ""
type = "separator"
separatorType = "blank line"
separatorHeader = ""
separatorHTML = "<tr>\n <td colspan='2'>\n </td>\n</tr>"

[csv_upload]
order = 7
label = "Import CSV File"
type = "upload"
fieldPrefix = ""
description = ""
isRequired = 1
allowedExtensions = "csv"
checkMaxUploadSize = 0
maxUploadSizeKB = 5120
checkMaxUploads = 1
maxUploads = 1
resizeOversizedImages = 0
maxImageHeight = 800
maxImageWidth = 600
createThumbnails = 0
maxThumbnailHeight = 150
maxThumbnailWidth = 150
createThumbnails2 = 0
maxThumbnailHeight2 = 150
maxThumbnailWidth2 = 150
createThumbnails3 = 0
maxThumbnailHeight3 = 150
maxThumbnailWidth3 = 150
createThumbnails4 = 0
maxThumbnailHeight4 = 150
maxThumbnailWidth4 = 150
useCustomUploadDir = 0
customUploadDir = ""
customUploadUrl = ""
infoField1 = ""
infoField2 = ""
infoField3 = ""
infoField4 = ""
infoField5 = ""

[fileFormat]
order = 8
label = "File Format"
type = "list"
defaultValue = ""
fieldPrefix = ""
description = ""
isRequired = 0
isUnique = 0
listType = "pulldown"
optionsType = "text"
optionsText = "csv|CSV (US/UK)\ncsvg|CSV (German)"

[hasColumnHeaders]
order = 9
label = "Has Column Headers"
type = "checkbox"
fieldPrefix = ""
checkedByDefault = 0
description = ""
checkedValue = "Yes"
uncheckedValue = "No"

[targetTable]
order = 10
label = "Target Table"
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

[__separator005__]
order = 11
label = ""
type = "separator"
separatorType = "header bar"
separatorHeader = "Import File Details"
separatorHTML = "<tr>\n <td colspan='2'>\n </td>\n</tr>"

[columnNamesMap]
order = 12
label = "Column Names"
type = "textbox"
defaultContent = ""
fieldPrefix = "Format: Col #|Col Name (one per line), Example: 1|SKU"
description = ""
isRequired = 0
isUnique = 0
minLength = ""
maxLength = ""
fieldHeight = 200
autoFormat = 0

[columnCount]
order = 13
label = "Column Count"
type = "textfield"
defaultValue = ""
fieldPrefix = ""
description = ""
fieldWidth = 100
isPasswordField = 0
isRequired = 0
isUnique = 0
minLength = ""
maxLength = ""
charsetRule = ""
charset = ""

[recordCount]
order = 14
label = "Record Count"
type = "textfield"
defaultValue = ""
fieldPrefix = ""
description = ""
fieldWidth = 100
isPasswordField = 0
isRequired = 0
isUnique = 0
minLength = ""
maxLength = ""
charsetRule = ""
charset = ""

[__separator001__]
order = 15
label = ""
type = "separator"
separatorType = "header bar"
separatorHeader = "Advanced Options"
separatorHTML = "<tr>\n <td colspan='2'>\n </td>\n</tr>"

[useIdField]
order = 16
label = "Use ID Field"
type = "checkbox"
fieldPrefix = ""
checkedByDefault = 0
description = "Duplicate records have the same value in this field "
checkedValue = "Yes"
uncheckedValue = "No"

[idField]
order = 17
label = ""
type = "textfield"
defaultValue = ""
fieldPrefix = "&nbsp; &nbsp; &nbsp; &nbsp;ID Field: "
description = ""
fieldWidth = 150
isPasswordField = 0
isRequired = 0
isUnique = 0
minLength = ""
maxLength = ""
charsetRule = ""
charset = ""

[updateDuplicates]
order = 18
label = ""
type = "checkbox"
fieldPrefix = "&nbsp; &nbsp; &nbsp;"
checkedByDefault = 0
description = "Update Duplicates: Update existing duplicate records instead of adding them again"
checkedValue = "Yes"
uncheckedValue = "No"

[removeOrphans]
order = 19
label = ""
type = "checkbox"
fieldPrefix = "&nbsp; &nbsp; &nbsp;"
checkedByDefault = 0
description = "Remove Orphans: Remove existing records if their ID isn't found in the import file"
checkedValue = "Yes"
uncheckedValue = "No"

[wipeDatabase]
order = 20
label = "Wipe Database"
type = "checkbox"
fieldPrefix = ""
checkedByDefault = 0
description = "Remove all existing records before importing new records"
checkedValue = "Yes"
uncheckedValue = "No"

[setAutoIncrement]
order = 21
label = ""
type = "checkbox"
fieldPrefix = "&nbsp; &nbsp; &nbsp;"
checkedByDefault = 0
description = "Start numbering new records at"
checkedValue = "Yes"
uncheckedValue = "No"

[newAutoIncrement]
order = 22
label = ""
type = "textfield"
defaultValue = ""
fieldPrefix = "&nbsp; &nbsp; &nbsp; &nbsp;Start #: "
description = ""
fieldWidth = 150
isPasswordField = 0
isRequired = 0
isUnique = 0
minLength = ""
maxLength = ""
charsetRule = ""
charset = ""

[__separator002__]
order = 23
label = ""
type = "separator"
separatorType = "header bar"
separatorHeader = "Map Fields"
separatorHTML = "<tr>\n <td colspan='2'>\n </td>\n</tr>"

[mapFields]
order = 24
label = "Map Fields"
type = "textbox"
defaultContent = ""
fieldPrefix = "Format: Col #|Target Field (one per line), Example: 1|title"
description = ""
isRequired = 0
isUnique = 0
minLength = ""
maxLength = ""
fieldHeight = 200
autoFormat = 0
