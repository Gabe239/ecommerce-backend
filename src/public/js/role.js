document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Event delegation to handle button clicks
        document.addEventListener('click', function(event) {
            if (event.target && event.target.nodeName === 'BUTTON') {
                if (event.target.classList.contains('edit-role-button')) {
                    const userId = event.target.getAttribute('data-user-id');
                    editRole(userId);
                } else if (event.target.classList.contains('delete-user-button')) {
                    const userId = event.target.getAttribute('data-user-id');
                    deleteUser(userId);
                }
            }
        });

        function editRole(userId) {
            const editRoleForm = document.getElementById('editRoleForm');
            const newRoleSelect = document.getElementById('newRole');
            newRoleSelect.setAttribute('data-user-id', userId);
            editRoleForm.style.display = 'block';

            newRoleSelect.addEventListener('change', saveRole);
        }

        async function saveRole() {
            const newRoleSelect = document.getElementById('newRole');
            const userId = newRoleSelect.getAttribute('data-user-id');
            const newRole = newRoleSelect.value;

            try {
                const response = await fetch(`/api/users/${userId}/role`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ role: newRole }),
                });

                if (response.ok) {
                    // Successfully updated the role
                    // You can update the view or take other actions here
                } else {
                    throw new Error(`Failed to update user role. Status: ${response.status}`);
                }
            } catch (error) {
                console.error(error);
            }
        }

        async function deleteUser(userId) {
            try {
                const response = await fetch(`/api/users/${userId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    // Successfully deleted the user
                    // You can update the view or take other actions here
                } else {
                    throw Error(`Failed to delete user. Status: ${response.status}`);
                }
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        console.error(error);
    }

    const saveRoleButton = document.getElementById('saveRoleButton');
    saveRoleButton.addEventListener('click', saveRole);
});