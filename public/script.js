document.getElementById('diseaseForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const disease = document.getElementById('disease').value;
    const imageInput = document.getElementById('imageInput').files[0];
    
    if (imageInput) {
        Tesseract.recognize(
            imageInput,
            'eng',
            { logger: (m) => console.log(m) }
        ).then(({ data: { text } }) => {
            console.log('Ingredients:', text);
            // Send ingredients and disease to server for analysis
            fetch('http://localhost:5000/check-ingredients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    disease: disease,
                    ingredients: text
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log({data})
                document.getElementById('results').innerHTML = `<p>${data.message}</p>`;
            })
            .catch(error => {
                document.getElementById('results').innerHTML = `<p>Error: ${error.message}</p>`;
            });
        });
    }
});