  function readValue() {
            // removes old error messages if any
            let oldMsg = document.querySelector('.msgElement');
            if (oldMsg) {
                oldMsg.remove();
            }

            // storing all values from input field in variables
            let employeeName = document.querySelector('#employeeName').value;
            let employeeID = document.querySelector('#employeeID').value;
            let requestType = document.querySelector('#request').value;
            let description = document.querySelector('#description').value;
            let startDate = document.querySelector('#start-date').value;
            let endDate = document.querySelector('#end_date').value;
            let priority = document.querySelector('#priority').value;

            //creates new element 'div' and adds class ".msgElement from style.css"
            let msgElement = document.createElement('div');
            msgElement.classList.add("msgElement");

            //conditons to validate the form while user entering the data
            if (employeeName == '') {
                msgElement.innerHTML = "Please enter Employee Name"
                document.querySelector('#emp').append(msgElement);
                document.querySelector('#employeeName').focus();
                return;
            } else if (employeeID == '') {
                msgElement.innerHTML = "Please enter valid Employee ID"
                document.querySelector('#empID').append(msgElement);
                document.querySelector('#employeeID').focus();
                duplicateID()
                return;
            } else if (employeeID.length < 6 || employeeID.length > 6) {
                msgElement.innerHTML = "Please enter 6 digit Employee ID"
                document.querySelector('#empID').append(msgElement);
                document.querySelector('#employeeID').focus();
                return;
            } else if (duplicateID(employeeID)) {
                msgElement.innerHTML = "Employee ID already exists"
                document.querySelector('#empID').append(msgElement);
                document.querySelector('#employeeID').focus();
            } else if (requestType == 'All') {
                msgElement.innerHTML = "Please select valid Request Type"
                document.querySelector('#request1').append(msgElement);
                document.querySelector('#request').focus();
                return;
            } else if (startDate == '') {
                msgElement.innerHTML = "Please enter Start Date"
                document.querySelector('#start').append(msgElement);
                document.querySelector('#start-date').focus();
                return;
            } else if (endDate == '') {
                msgElement.innerHTML = "Please enter End Date"
                document.querySelector('#end').append(msgElement);
                document.querySelector('#end_date').focus();
                return;
            } else if (endDate < startDate) {
                msgElement.innerHTML = "End Date cannot be prior to start Date"
                document.querySelector('#end').append(msgElement);
                document.querySelector('#end_date').focus();
                return;
            } else if (priority == 'All') {
                msgElement.innerHTML = "Please select Priority"
                document.querySelector('#priority1').append(msgElement);
                document.querySelector('#priority').focus();
                return;
            } else {
                DisplayName(employeeName, employeeID, requestType, description, startDate, endDate, priority)

                document.querySelector('#employeeForm').reset();
                createRow(dataStorage)

            }

        }
        let dataStorage = [];

        function DisplayName(employeeName, employeeID, requestType, description, startDate, endDate, priority) {
            dataStorage.push({
                empName: employeeName,
                empId: employeeID,
                reqType: requestType,
                descp: description,
                sDate: startDate,
                eDate: endDate,
                priority: priority,
                status: "Pending"
            })

        }

// checks for duplicate employee ID in array dataStorage
        function duplicateID(employeeID) {
            for (i = 0; i < dataStorage.length; i++) {
                if (dataStorage[i].empId === employeeID) {

                    return true
                }

            }
            return false
        }
// function to create table rows
        function createRow(data) {

            let row = "";

            for (i = 0; i < data.length; i++) {
                let statusClass = "";
                let approveDisabled = "";
                let rejectDisabled = "";
                if (data[i].status === "Approved") {
                    statusClass = "approveColor";
                    approveDisabled = "disabled";
                    rejectDisabled = "disabled";
                } else if (data[i].status === "Rejected") {
                    statusClass = "rejectColor";
                    rejectDisabled = "disabled";
                    approveDisabled = "disabled";

                } else {
                    statusClass = "pendingColor";
                }
                row += `<tr data-id="${data[i].empId}"><td> ${data[i].empId}</td><td> ${data[i].empName}</td>    <td> ${data[i].reqType}</td>
              <td> ${data[i].sDate}</td> <td> ${data[i].eDate}</td>   
                <td> ${data[i].priority}</td>   <td class="stsChange ${statusClass}">${data[i].status}</td>  <td><button type="button" class="btn btn-success btn-sm approve" ${approveDisabled}>Approve</button> / <button type="button" class="btn btn-danger btn-sm reject" ${rejectDisabled}>Reject</button></td>
                </tr>`

            }

            document.querySelector('#tbody').innerHTML = row;

        }

// Approve or reject the request after button click
        document.querySelector("#tbody").addEventListener('click', function (event) {

            let appBtn = event.target.closest(".approve");
            let rejBtn = event.target.closest(".reject");

            if (appBtn || rejBtn) {

                let row = event.target.closest("tr");
                let id = row.dataset.id;

                let record = dataStorage.find(item => item.empId == id);
                if (!record) return;

                if (appBtn) {
                    record.status = "Approved";
                    appBtn.disabled = true;

                }

                if (rejBtn) {
                    record.status = "Rejected";
                    rejBtn.disabled = true;

                }

            }
            createRow(dataStorage)
            localStorage.setItem("Employee Request Data", JSON.stringify(dataStorage))
            getData();
        });

// filter by status
        document.querySelector("#selectStatus").addEventListener('change', function filterValue(event) {
            event.preventDefault()
            let filterStatus = this.value;
            let filtered;
            if (filterStatus === "All") {
                createRow(dataStorage)
            } else {
                filtered = dataStorage.filter(item => item.status === filterStatus)

                createRow(filtered)
            }
        })

//search filter for employeee ID or Employee name
        document.querySelector("#searchInput").addEventListener('input', function searchValue(event) {
            event.preventDefault();
            let searchValue = this.value.toLowerCase();
            let filteredValue = dataStorage.filter(function (item) {
                return (item.empName.toLowerCase().includes(searchValue) ||
                    item.empId.toString().includes(searchValue));
            })

            createRow(filteredValue);

        })

        document.querySelector('#submit').addEventListener('click', function (e) {
            e.preventDefault();
            readValue();

        })

        function getData() {

            let storageData = localStorage.getItem("Employee Request Data");
            let converted = JSON.parse(storageData);
            console.log(converted);
        }
   
    
    
