[Unified Data Search](https://samhith02.github.io/Unified-data-search-app-sys/index)
Variable Declarations:
fileInput: Represents the file input element in the HTML document.
headerContainer, sheetContainer, dropdownContainer1/2/3: Containers to hold headers, sheets, and dropdowns respectively.
jsonData: Stores JSON data parsed from the uploaded file.
trendChart: Global variable to hold the trend graph instance.
originalHtml: Stores the original HTML content of the sheet container.
distinctValues1/2/3: Arrays to hold distinct values from different columns.
selectedColumnIndex1/2/3: Variables to track the selected column indices in dropdowns.
Initial Setup:
Hides dropdown and search containers initially using CSS (display: none).
Dropdown Creation Functions:
createDropdownOptions(values, containerId): Creates dropdown options based on provided values and appends them to the specified container.
createSearchableDropdownOptions(values, containerId): Similar to createDropdownOptions but includes search functionality.
Filtering Dropdown Options:
filterDropdownOptions(selectDropdown, query): Filters dropdown options based on the search query entered by the user.
File Input Event Listener:
When a file is selected, it reads the file data, converts it to JSON using the FileReader and XLSX libraries, populates dropdowns with distinct values, and generates tables based on the data.
Event Listeners for Dropdowns:
Listens to changes in dropdown selections and triggers functions to update filtered values accordingly.
Graph Generation:
Includes functions (generateTrendGraph, getRandomColor, sortByXAxis) to generate a trend graph based on selected dropdown values and data from the uploaded file.
Search Functionality:
Handles search queries entered by the user, selects corresponding dropdown values, and updates the data table accordingly using functions like handleSearchQuery, calculateStringSimilarity, levenshteinDistance.
Utility Functions:
Includes functions for sorting data points (sortByXAxis), generating HTML tables (generateHeaderTableHtml, generateDataTableHtml), getting distinct values from data (getDistinctColumnValues), and calculating string similarity (calculateStringSimilarity, levenshteinDistance).
Toggle Functions:
Functions (toggleGraph, closeGraph, toggleDropdowns) to toggle the visibility of dropdowns, search inputs, and the graph based on user actions.
Global Variables:
Declares global variables like trendChart, originalHtml, distinctValues1/2/3, and others to maintain state and handle interactions across different functions.
Overall, the code is structured to handle file uploads, display data in HTML tables, provide search and filtering capabilities, generate interactive graphs, and manage user interactions with dropdowns and search inputs. It utilizes various event listeners, utility functions, and libraries like XLSX and Chart.js to achieve these functionalities.










Output Screenshots:

<img width="383" alt="image" src="https://github.com/samhith02/Unified-data-search-app-sys/assets/167102207/e3c01134-80b4-42ff-9640-8d1cff5506d4">
<img width="387" alt="image" src="https://github.com/samhith02/Unified-data-search-app-sys/assets/167102207/cfc319bd-ac64-4f76-a05d-f76560a362fe">
<img width="388" alt="image" src="https://github.com/samhith02/Unified-data-search-app-sys/assets/167102207/83d319e7-3ede-42bd-866e-8d7707c1e961">


