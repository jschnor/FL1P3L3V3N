PLUGIN README
Permalinks - Create SEO optimized permalinks, custom URLS, or custom aliases for any page.
-------------------------------------------------------------------------------

GETTING STARTED
-------------------------------------------------------------------------------
This plugin allows content editors to define custom URLs (permalinks) for pages.

Before beginning, confirm that your server supports the following (or ask your host):
  .htaccess files, and Apache mod_rewrite extension

Next, upload the plugin and enable in under: Admin > Plugins.

Now go to: Admin > Code Generator > Permalinks and copy the .htaccess code.
Either add this code to the top of the .htaccess file in your web root folder,
or create a new .htaccess file if needed.

Reload a page on your website to ensure that adding or modifying the .htaccess
didn't cause any errors.  If it did, stop here, undo the changes, double-check that
your server supports the required features above, and contact support.

Next, enter an url of a page on your website that you know does not exist, such
as /page/should/not/be/here.php.  The 404 error message you see should end with
the following text: "Permalinks Dispatcher at example.com Port 80".  This lets
you know that the plugin is handling all requests.

Note: Some browser display a default browser help page instead a site specific
"404 Not Found" page.  If your browser displays the same 404 Not Found page no
matter what site you are on, make sure you turn that feature off so you can see
the actual Not Found pages that your server is sending.

If all of the above is working, read on to create your first permalink!


START YOUR LINKS WITH A SLASH TO AVOID BROKEN LINKS
AKA: Understanding absolute, document-relative, and site root-relative paths
-------------------------------------------------------------------------------
There are three kinds of web links:

  Absolute - This is the complete URL used to access the page from anywhere on
  the internet.  These always start with http:// or https://
  Example: http://www.example.com/products/widget65.php

  Site-Root Relative - This is the URL without the http:// or the domain.  These
  always start with a slash ("/").
  Example: /products/widget65.php

  Document-Relative - This is the path that gets you from one file to another and
  usually starts with the directory or filename of the file being linked to.  For
  example assuming you had these files:
    /index.php
    /about.php
    /contact/contact.php
    /products/widget65.php
    /products/widget66.php
  widget65.php can link to widget66.php like this: href="widget66.php"
  but about.php would need to link like this: href="products/widget66.php"
  and contact.php would need to go up a directory like this: href="../products/widget66.php"

All permalinks contain one or more slashes, and your browser can't tell the
difference between a permalink and subdirectory.  So to ensure all your links
go where you want them to, make sure you use Site-Root Relative links that
all start with a slash, like this: /contact/contact.php

Adobe/Dreamweaver Reference:
http://help.adobe.com/en_US/dreamweaver/cs/using/WScbb6b82af5544594822510a94ae8d65-7c44a.html


MANUALLY CREATING A PERMALINK FOR A VIEWER LIST PAGE OR PRE-EXISTING STATIC PAGE
-------------------------------------------------------------------------------
Viewer list pages need to have permalinks created manually, but you only need to
do it once and it's the same process you would follow if you wanted to create a
manual permalink for a single static php page that was already existing  on the
server.

For example, say you have this file on the website:
http://www.example.com/utils/other/contact-us-form.php

Which you would like to access by this URL:
http://www.example.com/contact/

To do this, go to: Admin > Plugins > Permalinks > Permalinks DB
- Click "Create" to create a new manual permalink
- In the "Permalink" field, enter: contact (leave off the leading and trailing /slashes/)
- In the "Custom Source Url" field, enter: /utils/other/contact-us-form.php

Viewer Lists work the same way, allowing you to view this URL:
http://www.example.com/news-list.php

With a permalink such as:
http://www.example.com/news/


AUTOMATICALLY CREATING PERMALINKS FOR DETAIL VIEWER PAGES
-------------------------------------------------------------------------------
For example, you have a section named "News" and example viewer details urls as follows:

Example Details Pages:
  http://www.example.com/news-detail.php?Local-sports-team-wins-championship-4133
  http://www.example.com/news-detail.php?Holiday-festival-this-weekend-4133

The plugin can automatically generate permalinks such as the following examples:
  http://www.example.com/news/local-sports-team-wins-championship/
  http://www.example.com/news/holiday-festival-this-weekend/

Your content editors will be able to create or change the permalinks however they like.

To get started, edit the section you want to add permalinks to and add a new
text field called "permalink".  If you would like all the permalinks for this
section to start with a prefix, such as /news/ or /news- then enter that as the
"Default Value" for the "permalink" field in the field editor.  If a "Default Value"
is set, then permalinks will only allow values that start with that text.

When creating a record, if the user enters some text for the permalink, that will
be saved.  Otherwise the permalink field will be automatically generated using
field content from the page.


HOW PERMALINK FIELDS ARE FORMATTED AND AUTOPOPULATED
-------------------------------------------------------------------------------
If a user doesn't specify a permalink value it will be automatically generated
using field content from the form.

The list of field names that are checked for content are listed at the top of
the plugin in the variable $GLOBALS['PERMALINKS']['autopopulate_fromFields'].
By default they are 'title' and 'name' but you can specify additional fields
or field combinations in the plugin.

The first field with content is used to create the permalink, so if title is set to "The quick brown fox"
and name is set to "John Smith" then the title is used ("The quick brown fox").

The plugin automatically generates SEO friendly links, by converting spaces to
dashes, removing non-word characters, and removing words that aren't relevant
to search engines such as 'a','an','and','as','at','before','but','by',etc.
This list of words can be modified at the top of the plugin in the following
variable: $GLOBALS['PERMALINKS']['autopopulate_skipWords']

The content "A quick brown fox jumps over the lazy dog" would be converted to
the permalink "/quick-brown-fox-jumps-over-lazy-dog/", with "a" and "the" removed.

If a generated permalink has the same name of an existing permalink then a number
is added to the end, such as ...dog-1, ...dog-2, etc.


STYLING THE PERMALINKS 404 NOT FOUND PAGE
-------------------------------------------------------------------------------
Because the Permalinks plugin handles all incoming links it must also display a
"Not Found" page when it can't find content.

This "Not Found" page can be found in the plugin folder and is named: permalinks_notFound404.php

You can view the output of the Not Found page by typing in a nonexistant url such as:
http://www.example.com/this/page/is-not-here.php

By default the Not Found page should display a message at the bottom like this that
will let you know it's working: "Permalinks Dispatcher at localhost Port 80"

To style the page, you can either specify an alternate 404 page in the variable
$alternate404Url or modify the HTML of the page as needed to match the design of your
site.


USING WORDPRESS PERMALINKS OR OTHER MOD_REWRITE SCRIPTS
-------------------------------------------------------------------------------
To use Wordpress Permalinks or other mod_rewrite scripts do the following:

- Make sure the Permalinks Plugin is listed before other mod_rewrite code in .htaccess

- Update permalinks.php and find this line near the top:
  $GLOBALS['PERMALINKS']['404_not_found_filepath']  = dirname(__FILE__) . '/permalinks_notFound404.php';

- Update that line to point to the filepath you want to process permalinks that aren't found, eg: /index.php for Wordpress:
  $GLOBALS['PERMALINKS']['404_not_found_filepath']  = $GLOBALS['SETTINGS']['webRootDir'] . '/index.php';

- Open your .htaccess and find this line:
  RewriteRule ^permalinks_dispatcher\.php$ - [L]

- To prevent redirect loops, add this line below the above line to ignore your permalink script (eg: index.php):
  RewriteRule ^index\.php$ - [L]

Test everything, and you're done!


LIMITATIONS AND ADDITIONAL TECHNICAL NOTES
-------------------------------------------------------------------------------
- The permalink field automatically displays the current hostname around the
textfield, eg: http://example.com/[_________________]/.  Whatever hostname you are
accessing the CMS through will be displayed.

- If you change a permalink, the old permalink will be saved in order to prevent broken links.
Any users visiting the old link will be redirected to the new one.  Whenever there
is more then one permalink defined for a page, the most recently saved permalink is
assumed to be the current one.

- For safety, the .htaccess mod_rewrite code only redirects if an existing file or
directory matching the permalink can't be found.  If a permalink matches the name
of an existing file then the existing file will always take priority.  So having a
permalink named /index.php won't work.

- The files in the plugin folder do as follows:
  permalinks.php - this is the main plugin file
  permalinks_codeGenerator.php - this file generates the code in the code generator
  permalinks_dispatcher.php - mod_rewrite sends all incoming requests for which
  ... there is no existing file or dir to this script, which looks up the permalink
  ... and load the correct file.
  permalinks_notFound404.php - when the dispatcher can't find a file this Not Found 404 page is displayed

-------------------------------------------------------------------------------
end of file.
