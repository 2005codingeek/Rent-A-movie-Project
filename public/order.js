document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = {
        customerId: document.getElementById('customerId').value,
        movieId: document.getElementById('movieId').value,
        price: document.getElementById('price').value,
        tax: document.getElementById('tax').value,
    };

    try {
        const response = await fetch('/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.text();
        alert(result);
    } catch (error) {
        console.error('Error:', error);
        alert('Error placing order');
    }
});
