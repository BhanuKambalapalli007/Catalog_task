document.getElementById("processBtn").addEventListener("click", () => {
    const fileInput = document.getElementById("fileInput");
    const textArea = document.getElementById("jsonInput");
    const output = document.getElementById("output");

    const processJSON = (jsonData) => {
        try {
            const data = JSON.parse(jsonData);
            const result = findConstant(data);
            output.textContent = `Secret: ${result}`;
        } catch (e) {
            output.textContent = "Error processing JSON. Please ensure the format is correct.";
        }
    };

    if (fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => processJSON(e.target.result);
        reader.readAsText(fileInput.files[0]);
    } else if (textArea.value.trim() !== "") {
        processJSON(textArea.value);
    } else {
        output.textContent = "Please upload a file or paste JSON input.";
    }
});

const findConstant = (data) => {
    const { keys, ...roots } = data;
    const { n, k } = keys;

    const points = Object.entries(roots)
        .slice(0, k) // Use only the required number of points
        .map(([x, { base, value }]) => [parseInt(x, 10), parseInt(value, base)]);

    const lagrangeInterpolation = (points) => {
        const k = points.length;

        const constantTerm = points.reduce((sum, [xi, yi], i) => {
            const product = points.reduce((prod, [xj], j) => {
                if (i !== j) prod *= -xj / (xi - xj);
                return prod;
            }, 1);
            return sum + yi * product;
        }, 0);

        return Math.round(constantTerm); // Return the rounded constant term
    };

    return lagrangeInterpolation(points);
};
