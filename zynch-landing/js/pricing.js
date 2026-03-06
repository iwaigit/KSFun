function togglePricing() {
    const sw = document.querySelector('.pricing-toggle-switch');
    const labels = document.querySelectorAll('.toggle-label');
    const currentState = sw.getAttribute('data-cycle') || 'monthly';
    let newState = 'monthly';

    if (currentState === 'monthly') newState = 'quarterly';
    else if (currentState === 'quarterly') newState = 'semestral';
    else newState = 'monthly';

    sw.setAttribute('data-cycle', newState);

    // Update labels
    labels.forEach(l => {
        l.classList.remove('active');
        if (l.classList.contains(newState)) l.classList.add('active');
    });

    // Update prices
    const priceElements = [
        { id: 'price-pro', element: document.getElementById('price-pro') },
        { id: 'price-elite', element: document.getElementById('price-elite') },
        { id: 'price-enterprise', element: document.getElementById('price-enterprise') }
    ];

    priceElements.forEach(p => {
        if (p.element) {
            const newPrice = p.element.getAttribute(`data-${newState}`);
            p.element.innerHTML = `$${newPrice}<span>/mes</span>`;
        }
    });
}

// Add event listeners to labels for direct clicking
document.addEventListener('DOMContentLoaded', () => {
    const labels = document.querySelectorAll('.toggle-label');
    labels.forEach(label => {
        label.addEventListener('click', (e) => {
            const sw = document.querySelector('.pricing-toggle-switch');
            const targetCycle = e.target.classList.contains('monthly') ? 'monthly' : 
                               e.target.classList.contains('quarterly') ? 'quarterly' : 'semestral';
            
            sw.setAttribute('data-cycle', targetCycle);
            
            // Re-use logic to update prices and labels
            document.querySelectorAll('.toggle-label').forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
            
            document.querySelectorAll('.price').forEach(p => {
                if (p.id) {
                    const price = p.getAttribute(`data-${targetCycle}`);
                    if (price) p.innerHTML = `$${price}<span>/mes</span>`;
                }
            });
        });
    });
});
