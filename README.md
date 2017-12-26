# Hosted location
https://fierce-meadow-54526.herokuapp.com/ (please allow a few moments for Data to propagate) 

# A data visualization of Vancouver's 2016 crime rate

This is an accumulation of interactive data for crime in Vancouver, British Colombia, Canada from January 2016 to early 2017.

## HTML

Having studied markup for dashboards from a few data scientists prior to beginning the project I had a clear preference for the [bar-chart -> row chart -> chloropleth/heatmap] layout 
as I found it to be functional whilst also aesthetically appealing. I have implemented the markup using a bootstrap template from keen.io and modified the breakpoints
such that the responsive display shows just before the 'neighbourhood' chart infringes on the timeline div. I opted not to use 
onboarding for the data as I felt the columns were sufficiently self-explanatory to not rouse any UX problems.

## CSS

I modified the numerous libraries in use in this project aswell as injected some custom CSS to achieve the style exhibited in the app.

## MongoDB

The data is stored in a Mongo collection on my C drive. I imported a CSV file which initially contained >500,000 columns and used
Mongo's delete many records command in the terminal to slim the data down to a workable (faster loading) dataset.

## Flask

As per guidelines I used python's Flask library to establish a connection with the MongoDB 'mongod' instance running in my terminal to 
serve the 'view' of the app. I initially ran into difficulty with this connection as I was served an error that I could not have a mix
of inclusion and exclusion in the projection. I had to re-check the database and discovered that I was trying to import another 'id'
field in the data which was hidden in my initial CSV file used to import the data to MongoDB. This data is non JSON serializable hence
I was receiving the error. 

Aside from preparing the app route functions for my imported CSV file I was also able to use flask to export my GEOJSON file for use in
my leaflet map.

## D3/DC/Crossfilter (charts) Panda/Leaflet(Map)

Thanks to the combination of these three libraries I was able to segregate the available JSON data and construct the graphs and charts displayed
on the dashboard. A problem I had initially was that my CSV file did not contain a headline column for date, as such I was left wanting
of a timestamp for my timeline barchart. To resolve this I used a forEach function to catch the day, month and year in a column and convert
the individual integers into a string which I was then able to parse into a string using d3's parse function. Aside from this I have just used standard DC/D3 code practice to display the data.

Lines 118 to 150 are code excerpts which I have taken from the docs section of leaflet.js's documentation and the function for filtering the
map is courtesy of Adil Moujahid (http://adilmoujahid.com/author/adil-moujahid.html). Prior to this I was quite unsure as to how to have
the map interact with the data, forgetting a class of filtered was applied to highlighted data.

## Heroku

I downloaded Heroku and using the dashboard and CLI was able to create an app. Using the mLab addon and the git interface I was able to push
all my data onto the partitioned server space which now hosts my dashboard. Upon constructing the app I ran into a problem whereby Shapely,
the python geometry library which overlays data on the map section from a GEOJSON conversion was missing a file from the GEOS library. To
resolve this I simply uninstalled Shapely 1.4.0 and installed v1.6.3 which is less liable for other python dependencies. This resolved the problem.
