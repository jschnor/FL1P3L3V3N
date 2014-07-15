PLUGIN README
CSV Import - Upload CSV files of any size to create and/or update records in
your existing sections.
-------------------------------------------------------------------------------


OVERVIEW
-------------------------------------------------------------------------------
This plugin allows you to quickly create and/or update your records by uploading
CSV files. If you have a lot of data to get into your CMS and can convert it
to a CSV file, you can use this plugin to save hours of copy-and-paste work.

CSV files are simple text files with lines of Comma-Separated Values, which are
the most popular way to convert and transfer data between different systems and
applications.

You can use this plugin to do one-time imports and also keep existing records
updated.


GETTING STARTED
-------------------------------------------------------------------------------
Activate the "CSV Import" plugin in the CMS under: Admin > Plugins.


USAGE
-------------------------------------------------------------------------------
You'll need two things to do an import: a CSV file and a section to import it
into. If you're importing into a section which already contains records, take a
backup of your database.

Log into your CMS and go to Admin > Plugins, then click the "Import CSV File"
link beside the CSV Import plugin. Upload a CSV file through your web browser,
select the table to import it into, then click Analyse Data. After the data is
analysed, you're ready to Choose Options.

With no options selected, each row of your CSV file will result in one record
being created. If you're importing into an empty section, you won't need to set
any options at all.

- Use ID Field - if you want to update existing records, you'll need to enable
this option and specify a field (e.g. SKU or num) which contains unique values
which can be used to determine which records are duplicates.

- Update Duplicates - with this option, you can update duplicates instead of
adding them. This allows you to "sync" your CMS database with other systems
such as inventory or point of sale databases.

- Remove Orphans - another advanced feature, Import CSV can detect when there
are records in your website database that are no longer in the import file and
automatically remove them.

- Wipe Database - an advanced feature for website developers, this allows you to
remove all the existing data in the target database and replace it with the
import data.

- Start Numbering - if you're wiping the database, you can also specify at what
number auto-incrementing fields (e.g. "num" fields) will start counting from.

Next, you'll need to fill out the "Map Fields" section, which determines which
columns in your CSV file will translate into which fields in your CMS table.
You can use the Live Preview at the bottom of the page as a reference to make
it easier to see which fields should go where.

Finally, click the "Validate Data" button to start your import.


TROUBLESHOOTING
-------------------------------------------------------------------------------
"MySQL Error: Data truncated for column ..."
This means the import data didn't fit in the target column, such as when the
target column and the import column has non-numeric data or if you are trying
to import text into a date field.  To resolve this error manually modify your
import data and re-upload your import file.


CAVEATS AND LIMITATIONS
-------------------------------------------------------------------------------
While this is a very powerful plugin, it has the current limitations:
- CSV Files must have column headers (the first line)
- Importing features are only available to CMS admin users
- Section Editor validation rules are not checked or enforced
- Multi value fields are not supported (such as multi-value list fields)

-------------------------------------------------------------------------------
end of file.
