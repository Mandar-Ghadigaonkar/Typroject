const searchInput = document.getElementById('searchInput');
        const searchButton = document.getElementById('searchButton');
        const tableBody = document.querySelector('tbody');

        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim();

            fetch(`/searchs?searchTerm=${searchTerm}`)
                .then(response => response.json())
                .then(data => {

                    renderSearchResults(data);
                })
                .catch(error => {
                    console.error('Error searching records:', error);
                });
        });

        // Function to render search results in the table without reversing the order
        function renderSearchResults(results) {

            tableBody.innerHTML = '';


            if (results.length === 0) {
                const noResultsRow = document.createElement('tr');
                noResultsRow.innerHTML = '<td colspan="11">No results found</td>';
                tableBody.appendChild(noResultsRow);
                return;
            }


            results.forEach(result => {
                const row = `
            <tr>
                <td>${result.id}</td>
                <td>${result.name}</td>
                <td>${result.clas}</td>
                <td>${result.email}</td>
                <td>${result.contact}</td>
                <td>${result.items}</td>
                <td>${result.total}</td>
                <td>${result.rentalDays}</td>
                <td>${result.orderDate}</td>
                <td id="status_${result.id}">${result.status}</td>
                <td>
                    <button class="update-status-button" onclick="updateStatus('${result.id}')">Update Status</button>
                </td>
            </tr>`;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        }

        // Function to update the status of an order
        function updateStatus(orderId) {
            const newStatus = prompt('Enter new status (e.g., Rented, Returned):');

            if (newStatus !== null && newStatus !== '') {
                // Update status in localStorage
                localStorage.setItem(`status_${orderId}`, newStatus);

                // Update the status in the frontend
                document.getElementById(`status_${orderId}`).textContent = newStatus;
            }
        }

        // Function to fetch order statuses from localStorage
        function fetchOrderStatuses() {
            const tableRows = document.querySelectorAll('tbody tr');

            tableRows.forEach(row => {
                const orderId = row.querySelector('td:first-child').textContent;
                const statusCell = row.querySelector(`#status_${orderId}`);
                const storedStatus = localStorage.getItem(`status_${orderId}`);

                if (storedStatus !== null) {
                    // Update the status in the frontend
                    statusCell.textContent = storedStatus;
                }
            });
        }

        // Fetch order statuses when the page loads
        window.addEventListener('DOMContentLoaded', fetchOrderStatuses);