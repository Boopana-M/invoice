function addItem() {
    const container = document.getElementById('itemsContainer');
    const itemGroup = document.createElement('div');
    itemGroup.classList.add('itemGroup');

    itemGroup.innerHTML = `
        <label>Item Description:</label>
        <input type="text" class="itemDescription" required>

        <label>Quantity:</label>
        <input type="number" class="quantity" required>

        <label>Price per Unit:</label>
        <input type="number" class="price" required>

        <label>Discount Rate (%):</label>
        <input type="number" class="discountRate">

        <label>Tax Rate (%):</label>
        <input type="number" class="taxRate">
    `;

    container.appendChild(itemGroup);
}

function convertNumberToWords(num) {
    const ones = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (num === 0) return ones[0];

    let words = '';
    if (num < 20) {
        words = ones[num];
    } else {
        const units = num % 10;
        const tensPlace = Math.floor(num / 10) % 10;
        words = tens[tensPlace] + (units ? ' ' + ones[units] : '');
    }

    return words.trim();
}

function generateInvoice() {
    const customerName = document.getElementById('customerName').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const invoiceDate = document.getElementById('invoiceDate').value;
    const invoiceNumber = document.getElementById('invoiceNumber').value;

    document.getElementById('displayCustomerName').innerText = customerName;
    document.getElementById('displayCustomerAddress').innerText = customerAddress;
    document.getElementById('displayInvoiceDate').innerText = invoiceDate;
    document.getElementById('displayInvoiceNumber').innerText = invoiceNumber;

    const items = document.querySelectorAll('.itemGroup');
    const tbody = document.getElementById('invoiceItems');
    tbody.innerHTML = '';
    let grandTotal = 0;

    items.forEach(item => {
        const description = item.querySelector('.itemDescription').value;
        const quantity = parseFloat(item.querySelector('.quantity').value);
        const price = parseFloat(item.querySelector('.price').value);
        const discountRate = parseFloat(item.querySelector('.discountRate').value) || 0;
        const taxRate = parseFloat(item.querySelector('.taxRate').value) || 0;

        const totalBeforeDiscount = quantity * price;
        const discount = (totalBeforeDiscount * discountRate) / 100;
        const taxableAmount = totalBeforeDiscount - discount;
        const tax = (taxableAmount * taxRate) / 100;
        const total = taxableAmount + tax;

        grandTotal += total;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${description}</td>
            <td>${quantity}</td>
            <td>${price.toFixed(2)}</td>
            <td>${discount.toFixed(2)}</td>
            <td>${tax.toFixed(2)}</td>
            <td>${total.toFixed(2)}</td>
        `;
        tbody.appendChild(row);
    });

    document.getElementById('grandTotal').innerText = grandTotal.toFixed(2);
    document.getElementById('grandTotalWords').innerText = convertNumberToWords(grandTotal);
    document.getElementById('invoice').style.display = 'block';
}

function printInvoice() {
    document.querySelector('form').style.display = 'none';
    document.getElementById('invoice').style.display = 'block';

    window.print();

    document.querySelector('form').style.display = 'block';
    document.getElementById('invoice').style.display = 'none';
}

function downloadInvoice() {
    const invoiceContent = document.getElementById('invoice').innerHTML;
    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'invoice.html';
    link.click();
}
