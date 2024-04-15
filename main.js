   var fileInput = document.getElementById('fileInput');
    var headerContainer = document.getElementById('headerContainer');
    var sheetContainer = document.getElementById('sheetContainer');
    var dropdownContainer1 = document.getElementById('dropdownContainer1');
    var dropdownContainer2 = document.getElementById('dropdownContainer2');
    var dropdownContainer3 = document.getElementById('dropdownContainer3');
    var jsonData;
     var trendChart; // Declare trendChart as a global variable  
    var originalHtml;  
    var distinctValues1 = [];
    var distinctValues2 = [];
    var distinctValues3 = [];
    var selectedColumnIndex1;
    var selectedColumnIndex2;
    var selectedColumnIndex3;
      
    
   // Hide dropdowns and their corresponding search inputs initially
var dropdownContainers = [
  document.getElementById('dropdownContainer1'),
  document.getElementById('dropdownContainer2'),
  document.getElementById('dropdownContainer3')
];
var searchContainers = [
  document.getElementById('searchDropdown1'),
  document.getElementById('searchDropdown2'),
  document.getElementById('searchDropdown3')
];

for (var i = 0; i < dropdownContainers.length; i++) {
  dropdownContainers[i].style.display = 'none';
  searchContainers[i].style.display = 'none';
}
   
  function createDropdownOptions(values, containerId) {
    var selectDropdown = document.createElement('select');
    selectDropdown.multiple = true; // Add multiple select option
    selectDropdown.addEventListener('change', updateFilteredValues);

    var optionDefault = document.createElement('option');
    optionDefault.textContent = 'All';
    optionDefault.value = 'All';
    selectDropdown.appendChild(optionDefault);

    for (var i = 0; i < values.length; i++) {
      var option = document.createElement('option');
      option.value = values[i];
      option.textContent = values[i];
      selectDropdown.appendChild(option);
    }

    var dropdownContainer = document.getElementById(containerId);
    dropdownContainer.innerHTML = ''; // Clear previous content
    dropdownContainer.appendChild(selectDropdown);
  }

  // Function to create dropdown options with search functionality

function createSearchableDropdownOptions(values, containerId) {
  var selectDropdown = document.createElement('select');
  selectDropdown.multiple = true; // Add multiple select option
  selectDropdown.addEventListener('change', updateFilteredValues);

  var optionDefault = document.createElement('option');
  optionDefault.textContent = 'All';
  optionDefault.value = 'All';
  selectDropdown.appendChild(optionDefault);

  for (var i = 0; i < values.length; i++) {
    var option = document.createElement('option');
    option.value = values[i];
    option.textContent = values[i];
    selectDropdown.appendChild(option);
  }

  var dropdownContainer = document.getElementById(containerId);
  dropdownContainer.innerHTML = ''; // Clear previous content
  dropdownContainer.appendChild(selectDropdown);
}
  function filterDropdownOptions(selectDropdown, query) {
    var options = selectDropdown.options;
    for (var i = 0; i < options.length; i++) {
      var option = options[i];
      if (option.textContent.toLowerCase().includes(query.toLowerCase())) {
        option.style.display = '';
      } else {
        option.style.display = 'none';
      }
    }
  }
 fileInput.addEventListener('change', function(e) {
    var file = e.target.files[0];
    var reader = new FileReader();

    reader.onload = function(event) {
      var data = new Uint8Array(event.target.result);
      var workbook = XLSX.read(data, { type: 'array' });

      // Assume the first sheet in the workbook
      var sheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[sheetName];

      // Convert the sheet to JSON
      jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });    

        // Get the header row
        var headerRow = jsonData[0];

        // Generate header table HTML
        var headerHtml = generateHeaderTableHtml(headerRow);

        // Generate data table HTML
        var dataHtml = generateDataTableHtml(jsonData);

        // Set the HTML in respective containers
        headerContainer.innerHTML = headerHtml;
        sheetContainer.innerHTML = dataHtml;
        originalHtml = dataHtml;
        
        // Get distinct values from the columns

      distinctValues1 = getDistinctColumnValues(jsonData, 0);
      createSearchableDropdownOptions(distinctValues1, 'dropdownContainer1');

      distinctValues2 = getDistinctColumnValues(jsonData, 1);
      createSearchableDropdownOptions(distinctValues2, 'dropdownContainer2');

      distinctValues3 = getDistinctColumnValues(jsonData, 2);
      createSearchableDropdownOptions(distinctValues3, 'dropdownContainer3');

        createDropdownOptionsForHeader(headerRow, 'dropdownContainer3');

        // Call updateFilteredValues to display the data table initially
        updateFilteredValues();
        generateTrendGraph();
      };

      reader.readAsArrayBuffer(file);
    });

    var searchInputDropdown1 = document.getElementById('searchDropdown1');
    var searchInputDropdown2 = document.getElementById('searchDropdown2');
    var searchInputDropdown3 = document.getElementById('searchDropdown3');

    var searchInputDropdown1 = document.getElementById('searchDropdown1');
    searchInputDropdown1.addEventListener('input', function () {
      var dropdown1 = document.getElementById('dropdownContainer1').getElementsByTagName('select')[0];
      filterDropdownOptions(dropdown1, this.value);
      updateFilteredValues();
    });

    var searchInputDropdown2 = document.getElementById('searchDropdown2');
    searchInputDropdown2.addEventListener('input', function () {
      var dropdown2 = document.getElementById('dropdownContainer2').getElementsByTagName('select')[0];
      filterDropdownOptions(dropdown2, this.value);
      updateFilteredValues();
    });

    var searchInputDropdown3 = document.getElementById('searchDropdown3');
    searchInputDropdown3.addEventListener('input', function () {
      var dropdown3 = document.getElementById('dropdownContainer3').getElementsByTagName('select')[0];
      filterDropdownOptions(dropdown3, this.value);
      updateFilteredValues();
    });
// Add an event listener to the search bar to handle the query
var searchQueryInput = document.getElementById('searchQuery');
searchQueryInput.addEventListener('input', function () {
  var query = this.value;
  handleSearchQuery(query);
});
      
     var searchQueryInput = document.getElementById('searchQuery');
searchQueryInput.addEventListener('input', function (event) {
  if (event.key === 'Enter') {
    handleSearchQuery(this.value);
  }
});
    
 // Add an event listener to the "View Dropdowns" button
var viewDropdownsButton = document.getElementById('viewDropdownsButton');
viewDropdownsButton.addEventListener('click', function () {
  toggleDropdowns();
});   
 
    // class to the "All" options in the dropdowns for easier handling
    var allOptionClassName = 'all-option';

    // Function to hide or show all rows based on the "All" option selection
    function updateAllOption(container, columnIndex) {
      var dropdown = container.getElementsByTagName('select')[0];
      var allOptionSelected = Array.from(dropdown.options).some(option => option.selected && option.classList.contains(allOptionClassName));

      var rows = sheetContainer.getElementsByTagName('tr');
      for (var i = 1; i < rows.length; i++) {
        var cell = rows[i].getElementsByTagName('td')[columnIndex];
        rows[i].style.display = allOptionSelected ? '' : 'none';
        if (!allOptionSelected && dropdown.value !== 'All' && cell) {
          if (cell.textContent !== dropdown.value) {
            rows[i].style.display = 'none';
          }
        }
      }
    }

    function generateHeaderTableHtml(headerRow) {
      var html = '<table><tr>';
      for (var i = 0; i < headerRow.length; i++) {
        html += '<th>' + headerRow[i] + '</th>';
      }
      html += '</tr></table>';
      return html;
    }

    function generateDataTableHtml(data) {
      var html = '<table>';
      for (var i = 0; i < data.length; i++) {
        html += '<tr>';
        for (var j = 0; j < data[i].length; j++) {
          html += '<td>' + data[i][j] + '</td>';
        }
        html += '</tr>';
      }
      html += '</table>';
      return html;
    }

    function getDistinctColumnValues(data, columnIndex) {
      var values = [];
      for (var i = 1; i < data.length; i++) {
        var value = data[i][columnIndex];
        if (!values.includes(value)) {
          values.push(value);
        }
      }
      return values;
    }

    function createDropdownOptions(values, containerId) {
      var selectDropdown = document.createElement('select');
      selectDropdown.multiple = true; // Add multiple select option
      selectDropdown.addEventListener('change', updateFilteredValues);

      var optionDefault = document.createElement('option');
      optionDefault.textContent = 'All';
      optionDefault.value = 'All';
      selectDropdown.appendChild(optionDefault);

      for (var i = 0; i < values.length; i++) {
        var option = document.createElement('option');
        option.value = values[i];
        option.textContent = values[i];
        selectDropdown.appendChild(option);
      }

      var dropdownContainer = document.getElementById(containerId);
      dropdownContainer.innerHTML = ''; // Clear previous content
      dropdownContainer.appendChild(selectDropdown);
    }

    function createDropdownOptionsForHeader(headerRow, containerId) {
      var selectDropdown = document.createElement('select');
      selectDropdown.multiple = true; // Add multiple select option
      selectDropdown.addEventListener('change', function(){                             
        var selectedOptions = Array.from(this.options).filter(option => option.selected);
        var selectedIndices = selectedOptions.map(option => option.index - 1);
selectedColumnIndex3 = this.selectedIndex - 1; // Add this line to update the selectedColumnIndex3 variable

        // Show selected columns
        showSelectedColumns(selectedIndices);
      });

      var optionDefault = document.createElement('option');
      optionDefault.textContent = 'Select Column';
      selectDropdown.appendChild(optionDefault);

      for (var i = 0; i < headerRow.length; i++) {
        var option = document.createElement('option');
        option.value = headerRow[i];
        option.textContent = headerRow[i];
        selectDropdown.appendChild(option);
      }

      var dropdownContainer = document.getElementById(containerId);
      dropdownContainer.innerHTML = ''; // Clear previous content
      dropdownContainer.appendChild(selectDropdown);
    }
    function showSelectedColumns(selectedIndices) {
      var rows = sheetContainer.getElementsByTagName('tr');
      for (var i = 0; i < rows.length; i++) {
        var cells = rows[i].getElementsByTagName('td');
        for (var j = 0; j < cells.length; j++) {
          if (selectedIndices.includes(j)) {
            cells[j].style.display = '';
          } else {
            cells[j].style.display = 'none';
          }
        }
      }
    }
function updateFilteredValues() {
  var selectedDropdown1 = dropdownContainer1.getElementsByTagName('select')[0];
  var selectedValues1 = getSelectedValues(selectedDropdown1);

  var selectedDropdown2 = dropdownContainer2.getElementsByTagName('select')[0];
  var selectedValues2 = getSelectedValues(selectedDropdown2);

  var selectedDropdown3 = dropdownContainer3.getElementsByTagName('select')[0];
  var selectedIndices3 = getSelectedIndices(selectedDropdown3);

  var rows = sheetContainer.getElementsByTagName('tr');
  for (var i = 1; i < rows.length; i++) {
    var cell1 = rows[i].getElementsByTagName('td')[0].textContent;
    var cell2 = rows[i].getElementsByTagName('td')[1].textContent;
    var cell3 = rows[i].getElementsByTagName('td')[2].textContent;

    var selectedColIncluded = selectedIndices3.includes(selectedColumnIndex3) || selectedIndices3.includes(-1);

    var rowVisible =
      (selectedValues1.length === 0 || selectedValues1.includes(cell1) || selectedValues1.includes("All")) &&
      (selectedValues2.length === 0 || selectedValues2.includes(cell2) || selectedValues2.includes("All"));

    // If the selected column in dropdown3 is included, show the row only if it matches the selected value
    if (selectedColIncluded) {
      rows[i].style.display = rowVisible ? '' : 'none';
      var cells = rows[i].getElementsByTagName('td');
      for (var j = 0; j < cells.length; j++) {
        cells[j].style.display = j === selectedColumnIndex3 ? '' : 'none';
      }
    } else {
      // If the selected column in dropdown3 is not included, hide the row
      rows[i].style.display = 'none';
    }
  }

  // Show/hide the data table based on dropdown selections
  var display = (selectedValues1.length > 0 || selectedValues2.length > 0 || selectedIndices3.length > 0) ? 'block' : 'none';
  sheetContainer.style.display = display;

  // Hide all columns except the selected one in dropdown3
  var rows = sheetContainer.getElementsByTagName('tr');
  for (var i = 0; i < rows.length; i++) {
    var cells = rows[i].getElementsByTagName('td');
    for (var j = 0; j < cells.length; j++) {
      if (j !== selectedColumnIndex3) {
        cells[j].style.display = 'none';
      }
    }
  }
}

   function getSelectedValues(select) {
      var selectedValues = [];
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].selected) {
          selectedValues.push(select.options[i].value);
        }
      }
      return selectedValues;
    }

    function getSelectedIndices(select) {
      var selectedIndices = [];
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].selected) {
          selectedIndices.push(i - 1);
        }
      }
      return selectedIndices;
    }
      
      
       function sortByXAxis(dataPoints) {
    dataPoints.sort((a, b) => {
      if (a.x < b.x) return -1;
      if (a.x > b.x) return 1;
      return 0;
    });
  }  
        
      //Graph function
function generateTrendGraph() {
  // Get the selected values from dropdowns
  var selectedDropdown1 = dropdownContainer1.getElementsByTagName('select')[0];
  var selectedValues1 = getSelectedValues(selectedDropdown1);

  var selectedDropdown2 = dropdownContainer2.getElementsByTagName('select')[0];
  var selectedValues2 = getSelectedValues(selectedDropdown2);

  // Filter the data based on selected values from Dropdown 2
  var filteredData = jsonData.filter(row => selectedValues2.includes(row[1]));

  // Create datasets for the trend graph
  var datasets = [];
  for (var i = 0; i < selectedValues2.length; i++) {
    var filteredPoints = filteredData.filter(row => row[1] === selectedValues2[i]);
    var dataPoints = filteredPoints.map(row => {
      var xValue = row[0]; // Value for X-axis (Dropdown 1)
      var yValue = parseFloat(row[selectedColumnIndex3]); // Value for Y-axis (Dropdown 3)
      return {
        x: xValue,
        y: yValue
      };
    });

    // Sort the data points based on X-axis (Dropdown 1) values
    dataPoints.sort((a, b) => a.x - b.x); // Sort by ascending x-values

    datasets.push({
      label: selectedValues2[i],
      data: dataPoints,
      borderColor: getRandomColor(),
      fill: false
    });
  }

  // Destroy the previous chart instance if it exists
  if (trendChart) {
    trendChart.destroy();
  }

  // Create and render the trend graph
  trendChart = new Chart('trendGraph', {
    type: 'line',
    data: {
      labels: distinctValues1, // Use distinctValues1 for X-axis labels
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: 'top'
      },
      title: {
        display: true,
        text: 'Trend Graph'
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Dropdown 1'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Dropdown 3 Values'
          }
        }
      }
    }
  });
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Function to toggle the visibility of the graph, dropdowns, and search bars
function toggleGraph() {
  var graphContainer = document.getElementById('graphContainer');
  var dropdownContainer2 = document.getElementById('dropdownContainer2');
  var dropdownContainer3 = document.getElementById('dropdownContainer3');
  var searchDropdown3 = document.getElementById('searchDropdown3');
  var sheetContainer = document.getElementById('sheetContainer');

  if (graphContainer.style.display === 'none') {
    // If the graph is hidden, show it, Dropdown 2, Dropdown 3, and their search bars
    graphContainer.style.display = 'block';
    dropdownContainer2.style.display = 'block';
    dropdownContainer3.style.display = 'block';
    searchDropdown3.style.display = 'block';
    sheetContainer.style.display = 'none'; // Hide the main data table
    generateTrendGraph();
  } else {
    // If the graph is visible, hide it, Dropdown 2, Dropdown 3, and their search bars
    graphContainer.style.display = 'none';
    dropdownContainer2.style.display = 'none';
    dropdownContainer3.style.display = 'none';
    searchDropdown3.style.display = 'none';
    sheetContainer.style.display = 'block';
  }
}

// Function to close the graph and show the main data table
function closeGraph() {
  var graphContainer = document.getElementById('graphContainer');
  var dropdownContainer2 = document.getElementById('dropdownContainer2');
  var dropdownContainer3 = document.getElementById('dropdownContainer3');
  var searchDropdown2 = document.getElementById('searchDropdown2');
  var searchDropdown3 = document.getElementById('searchDropdown3');
  var sheetContainer = document.getElementById('sheetContainer');
  
  graphContainer.style.display = 'none';
  dropdownContainer2.style.display = 'none';
  dropdownContainer3.style.display = 'none';
  searchDropdown2.style.display = 'none';
  searchDropdown3.style.display = 'none';
  sheetContainer.style.display = 'block';
}

// Function to handle the search query
function handleSearchQuery(query) {
  // Clear previous results
  clearSelectedOptions();
  var sentenceContainer = document.querySelector('#sheetContainer + p');
  if (sentenceContainer) {
    sentenceContainer.remove();
  }

  var regex = /^(.+?) of (.+?) in (.+)$/i;
  var matches = query.match(regex);

  if (matches && matches.length === 4) {
    var firstKeyword = matches[1];
    var secondKeyword = matches[2];
    var thirdKeyword = matches[3];

    var dropdown1 = dropdownContainer1.getElementsByTagName('select')[0];
    var dropdown2 = dropdownContainer2.getElementsByTagName('select')[0];
    var dropdown3 = dropdownContainer3.getElementsByTagName('select')[0];

    // Search and select the keywords in the respective dropdowns
    searchAndSelectKeyword(secondKeyword, dropdown2); // Select in Dropdown 2
    searchAndSelectKeyword(thirdKeyword, dropdown1); // Select in Dropdown 3

    // Find and select the closest matching option in dropdown3
    findAndSelectClosestOption(firstKeyword, dropdown3);

    // Update the data table based on the selected values
    selectedColumnIndex3 = dropdown3.selectedIndex - 1; // Update selectedColumnIndex3
    updateFilteredValues(); // Call this function to update the table

    var selectedValueDropdown1 = dropdown1.value;
    var selectedValueDropdown2 = dropdown2.value;
    var selectedValueDropdown3 = dropdown3.value;

    // Create the sentence to describe the search query
    var sentence = `The ${selectedValueDropdown3} of ${selectedValueDropdown2} as on ${selectedValueDropdown1} are`;

    // Display the sentence above the table
    var sentenceContainer = document.createElement('p');  
    sentenceContainer.textContent = sentence;
   sentenceContainer.style.color = 'black';
    sentenceContainer.style.backgroundColor = '#70FFD9'; // Add this line to set background color
sentenceContainer.style.padding = '10px';
     sentenceContainer.style.width = '1000px'; // Add this line to set width
 sheetContainer.parentNode.insertBefore(sentenceContainer, sheetContainer.nextSibling);

    // Get the selected value from the filtered data table cell
    var filteredCell = document.querySelector('tr[style=""] td:nth-child(' + (selectedColumnIndex3 + 1) + ')');
    var filteredValue = filteredCell ? filteredCell.textContent : '';

    // Add the filtered value to the sentence
    sentenceContainer.textContent += ` ${filteredValue}`;
    hideFilteredDataCell();
  
  }
}

    // Function to search and select the keyword in a dropdown
    function searchAndSelectKeyword(keyword, dropdown) {
      var options = dropdown.options;
      for (var i = 0; i < options.length; i++) {
        if (options[i].textContent.toLowerCase().includes(keyword.toLowerCase())) {
          options[i].selected = true;
          break; // Exit loop once a match is found
        }
      }
    }

// Function to find and select the closest option in dropdown
function findAndSelectClosestOption(keyword, dropdown) {
  var options = dropdown.options;
  var closestMatch = null;
  var closestScore = -1; // Initialize to a negative value

  for (var i = 0; i < options.length; i++) {
    var optionText = options[i].textContent;
    var score = calculateStringSimilarity(keyword, optionText);

    if (score > closestScore) {
      closestMatch = options[i];
      closestScore = score;
    }
  }

  if (closestMatch) {
    closestMatch.selected = true;
  }
}

// Function to calculate string similarity using Levenshtein distance
function calculateStringSimilarity(str1, str2) {
  var maxLength = Math.max(str1.length, str2.length);
  var distance = levenshteinDistance(str1, str2);
  return 1 - distance / maxLength; // Normalize the similarity score
}


// Function to calculate Levenshtein distance between two strings
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  var matrix = [];

  // Initialize matrix
  for (var i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (var j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Calculate Levenshtein distance
  for (var i = 1; i <= b.length; i++) {
    for (var j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Function to clear all selected options in the dropdowns
function clearSelectedOptions() {
  var dropdowns = [
    document.getElementById('dropdownContainer1').getElementsByTagName('select')[0],
    document.getElementById('dropdownContainer2').getElementsByTagName('select')[0],
    document.getElementById('dropdownContainer3').getElementsByTagName('select')[0]
  ];

  for (var i = 0; i < dropdowns.length; i++) {
    for (var j = 0; j < dropdowns[i].options.length; j++) {
      dropdowns[i].options[j].selected = false;
    }
  }
}

// Add an event listener to the search query input to clear selected options
var searchQueryInput = document.getElementById('searchQuery');
searchQueryInput.addEventListener('input', function () {
  clearSelectedOptions();
});

    
// Function to toggle the visibility of the dropdowns and search inputs
function toggleDropdowns() {
  var dropdownContainers = [
    document.getElementById('dropdownContainer1'),
    document.getElementById('dropdownContainer2'),
    document.getElementById('dropdownContainer3')
  ];
  var searchContainers = [
    document.getElementById('searchDropdown1'),
    document.getElementById('searchDropdown2'),
    document.getElementById('searchDropdown3')
  ];

  for (var i = 0; i < dropdownContainers.length; i++) {
    if (dropdownContainers[i].style.display === 'none') {
      dropdownContainers[i].style.display = 'block';
      searchContainers[i].style.display = 'block';
    } else {
      dropdownContainers[i].style.display = 'none';
      searchContainers[i].style.display = 'none';
    }
  }
}
  // Function to hide the filtered data cell
function hideFilteredDataCell() {
  var filteredCell = document.querySelector('tr[style=""] td:nth-child(' + (selectedColumnIndex3 + 1) + ')');
  if (filteredCell) {
    filteredCell.style.display = 'none';
  }
}

  