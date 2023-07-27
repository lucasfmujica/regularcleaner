Webflow.push(function () {
    document.getElementById('bedrooms').value = '1';
    document.getElementById('bathrooms').value = '1';
});

var howOftenSelect;
var costPerHour = 15;

$(document).ready(function () {
    // get the input elements and buttons
    var bedroomsInput = document.getElementById('bedrooms');
    var bedroomsLabel = document.getElementById('bedrooms-label');
    var decreaseBedroomsButton = document.getElementById('decreaseBedrooms');
    var increaseBedroomsButton = document.getElementById('increaseBedrooms');

    var bathroomsInput = document.getElementById('bathrooms');
    var bathroomsLabel = document.getElementById('bathrooms-label');
    var decreaseBathroomsButton = document.getElementById('decreaseBathrooms');
    var increaseBathroomsButton = document.getElementById('increaseBathrooms');
    // Assign the select element to howOftenSelect
    howOftenSelect = $('#How-often');

    // get the extra service elements
    var extraServices = document.querySelectorAll('.calculator_extra-item');

    // get the range slider
    var rangeSlider = document.querySelector('[fs-rangeslider-element="wrapper"]');

    // get the recommended hours element
    var hoursRecommended = document.querySelector('#hoursRecommended');

    // get the fill and handle elements
    var fill = document.querySelector('[fs-rangeslider-element="fill"]');
    var handle = document.querySelector('[fs-rangeslider-element="handle"]');

    // get the display value element
    var displayValue = document.querySelector(
        '[fs-rangeslider-element="display-value"]'
    );

    // variable to keep track of the total extra time
    var extraTime = 0;

    // get the display elements
    var hoursDisplayElems = document.querySelectorAll('.hoursdisplay');
    var hoursCostDisplayElems = document.querySelectorAll('.hourscostdisplay');
    var totalCostDisplayElems = document.querySelectorAll('.totalcostdisplay');
    var totalPriceDisplayElems = document.querySelectorAll('.totalpricedisplay');
    var summaryExtra = document.querySelectorAll('.calculator_summary-extra');

    // function to update the total time based on the extra services selected
    function updateExtraTime() {
        // calculate total time from bedrooms, bathrooms and extra services
        var totalTime = Math.ceil(
            Number(bedroomsInput.value) * 0.75 +
                Number(bathroomsInput.value) * 0.75 +
                extraTime
        );

        // Cap totalTime to a maximum of 8
        totalTime = Math.min(totalTime, 8);

        // calculate the recommended hours, adding 1 to the total time and rounding it
        var recommendedHours = Math.min(Math.round(totalTime + 1), 8);

        // update the recommended hours text
        hoursRecommended.textContent =
            (recommendedHours < 8 ? recommendedHours : '8+') + ' hours';

        // calculate the cost based on total time
        var totalCost = displayValue.textContent * costPerHour;

        // update the hours display
        hoursDisplayElems.forEach(function (hoursdisplay) {
            hoursdisplay.textContent = '(' + displayValue.textContent + ' hours)';
        });

        // update the hours cost display
        hoursCostDisplayElems.forEach(function (hourscostdisplay) {
            hourscostdisplay.textContent = displayValue.textContent + '.0 hours';
        });

        // update the total cost display
        totalCostDisplayElems.forEach(function (totalcostdisplay) {
            totalcostdisplay.textContent = '£' + totalCost.toFixed(2);
        });

        totalPriceDisplayElems.forEach(function (totalpricedisplay) {
            totalpricedisplay.textContent = '£' + totalCost.toFixed(2);
        });
    }

    // add change event listener to the range slider
    rangeSlider.addEventListener('change', updateExtraTime);

    // decrement bedrooms value and update total time
    decreaseBedroomsButton.addEventListener('click', function (e) {
        e.preventDefault();
        var currentValue = Number(bedroomsInput.value);
        if (currentValue > 1) {
            bedroomsInput.value = currentValue - 1;
            bedroomsLabel.textContent =
                bedroomsInput.value +
                ' Bedroom' +
                (bedroomsInput.value > 1 ? 's' : '');
        }
        updateExtraTime();
    });

    // increment bedrooms value and update total time
    increaseBedroomsButton.addEventListener('click', function (e) {
        e.preventDefault();
        var currentValue = Number(bedroomsInput.value);
        if (currentValue < 10) {
            bedroomsInput.value = currentValue + 1;
            bedroomsLabel.textContent =
                bedroomsInput.value +
                ' Bedroom' +
                (bedroomsInput.value > 1 ? 's' : '');
        }
        updateExtraTime();
    });

    // decrement bathrooms value and update total time
    decreaseBathroomsButton.addEventListener('click', function (e) {
        e.preventDefault();
        var currentValue = Number(bathroomsInput.value);
        if (currentValue > 1) {
            bathroomsInput.value = currentValue - 1;
            bathroomsLabel.textContent =
                bathroomsInput.value +
                ' Bathroom' +
                (bathroomsInput.value > 1 ? 's' : '');
        }
        updateExtraTime();
    });

    // increment bathrooms value and update total time
    increaseBathroomsButton.addEventListener('click', function (e) {
        e.preventDefault();
        var currentValue = Number(bathroomsInput.value);
        if (currentValue < 10) {
            bathroomsInput.value = currentValue + 1;
            bathroomsLabel.textContent =
                bathroomsInput.value +
                ' Bathroom' +
                (bathroomsInput.value > 1 ? 's' : '');
        }
        updateExtraTime();
    });

    // add click event listener to each service
    extraServices.forEach(function (service) {
        service.addEventListener('click', function (e) {
            e.preventDefault();

            // get the corresponding input for this service
            var input = document.querySelector('#' + service.id + 'Input');

            // check if this service is already selected
            if (input.value === 'true') {
                // if it is, unselect it and subtract 0.5 from the total time
                input.value = 'false';
                extraTime -= 0.5;
            } else {
                // if it's not, select it and add 0.5 to the total time
                input.value = 'true';
                extraTime += 0.5;
            }

            // update the total time
            updateExtraTime();

            // check if this service is already selected
            if (input.value === 'false') {
                // if it was selected, remove the item from all summaries
                summaryExtra.forEach(function (summary) {
                    var item = summary.querySelector(
                        '.calculator_summary-extra-item[data-service="' +
                            service.id +
                            '"]'
                    );
                    if (item) {
                        summary.removeChild(item);
                    }
                });
            } else {
                // if it was not selected, add the item to all summaries
                summaryExtra.forEach(function (summary) {
                    var item = document.createElement('div');
                    item.classList.add('calculator_summary-extra-item');
                    item.dataset.service = service.id;
                    var itemText = document.createElement('span');
                    itemText.classList.add(
                        'text-size-small',
                        'text-weight-bold',
                        'text-color-light-grey'
                    );
                    itemText.textContent =
                        '+ ' +
                        service.id.charAt(0).toUpperCase() +
                        service.id.slice(1);
                    item.appendChild(itemText);
                    summary.appendChild(item);
                });
            }
        });
    });

    const timeSelect = $('#Time');
    let dateInput;

    function updateDateDisplay() {
        var dateDisplayElems = document.querySelectorAll('.datedisplay');

        const timeValue = timeSelect.val();
        const dateValue = new Date(dateInput.value);
        const formattedDate = formatDate(dateValue);

        dateDisplayElems.forEach(function (datedisplay) {
            datedisplay.textContent = timeValue + ', ' + formattedDate;
        });
    }

    function formatDate(date) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];

        const dayName = days[date.getUTCDay()];
        const dayNumber = date.getUTCDate();
        const monthName = months[date.getUTCMonth()];

        return dayName + ' ' + dayNumber + ' ' + monthName;
    }
    dateInput = document.getElementById('dateInput');
    const initialDate = new Date();
    let currentDate = new Date();
    const monthDisplay = document.getElementById('monthDisplay');
    const nextMonthButton = document.getElementById('nextMonth');
    const lastMonthButton = document.getElementById('lastMonth');

    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    function updateDateSelector() {
        const daysToShow = document.documentElement.clientWidth <= 479 ? 5 : 8;
        const startDay = document.documentElement.clientWidth <= 479 ? 2 : 3; // Starts two days before on Mobile

        monthDisplay.textContent =
            monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear();

        for (let i = 0; i < daysToShow; i++) {
            const date = new Date(currentDate.getTime());
            date.setDate(currentDate.getDate() - startDay + i);
            updateDatesAndListeners(date, i);
        }
    }

    function updateDatesAndListeners(date, i) {
        const dayElement = document.getElementById('day' + (i + 1));
        dayElement.textContent = date.getDate();

        const monthElement = document.getElementById('month' + (i + 1));
        monthElement.textContent = monthNames[date.getMonth()];

        const parentElement = dayElement.parentElement;
        parentElement.removeEventListener('click', parentElement.eventListener);

        if (date < initialDate) {
            parentElement.classList.add('disabled');
        } else {
            parentElement.classList.remove('disabled');

            parentElement.eventListener = function (e) {
                e.preventDefault();

                if (!this.classList.contains('disabled')) {
                    const selectedDate = new Date(date);
                    dateInput.value = selectedDate.toISOString().split('T')[0];

                    setTimeout(function () {
                        $(dateInput).trigger('input');
                        updateDateDisplay();
                    }, 0);

                    $('.calculator_date-day').removeClass('active');
                    this.classList.add('active');
                }
            };

            parentElement.addEventListener('click', parentElement.eventListener);
        }
    }

    nextMonthButton.addEventListener('click', function (e) {
        e.preventDefault();
        const daysToAdd = document.documentElement.clientWidth <= 479 ? 5 : 8;
        currentDate.setDate(currentDate.getDate() + daysToAdd);
        updateDateSelector();
    });

    lastMonthButton.addEventListener('click', function (e) {
        e.preventDefault();

        const daysToSubtract = document.documentElement.clientWidth <= 479 ? 5 : 8;
        currentDate.setDate(currentDate.getDate() - daysToSubtract);
        if (currentDate < initialDate) {
            currentDate = new Date(initialDate.getTime());
        }
        updateDateSelector();
    });

    updateDateSelector();

    const currentDayElement = document.getElementById(
        'day' + (document.documentElement.clientWidth <= 479 ? 3 : 4)
    );
    if (!currentDayElement.parentElement.classList.contains('disabled')) {
        currentDayElement.parentElement.click();
    }
    var dateDisplayElems = document.querySelectorAll('.datedisplay');

    timeSelect.change(function () {
        updateDateDisplay();
    });

    dateInput.addEventListener('input', function () {
        updateDateDisplay();
    });

    updateDateDisplay();

    const oftenDisplayElems = document.querySelectorAll('.oftendisplay'); // All elements with class "oftendisplay"
    const priceDisplayElems = document.querySelectorAll('.pricedisplay'); // All elements with class "priceDisplay"
    // Assign the select element to howOftenSelect
    howOftenSelect = $('#How-often');

    // Function to update the display elements
    function updateOftenDisplay() {
        // Get the selected option from the select
        const selectedOption = howOftenSelect.find(':selected').text();

        // Update the text of all display elements
        oftenDisplayElems.forEach(function (oftendisplay) {
            oftendisplay.textContent = selectedOption;
        });

        // Determine the price based on the selected option
        switch (selectedOption) {
            case 'Every week':
                costPerHour = 15;
                break;
            case 'Twice in a month':
                costPerHour = 16;
                break;
            case 'One - off':
                costPerHour = 18;
                break;
            default:
                costPerHour = 15;
        }

        const price = '£' + costPerHour.toFixed(2);
        priceDisplayElems.forEach(function (pricedisplay) {
            pricedisplay.textContent = price;
        });

        // Call updateExtraTime function to recalculate the total cost
        updateExtraTime();
    }

    // Add event listener to the select
    // This will call updateOftenDisplay every time the user selects a different option
    howOftenSelect.change(updateOftenDisplay);

    // Call updateOftenDisplay initially to display the default value
    updateOftenDisplay();
});
