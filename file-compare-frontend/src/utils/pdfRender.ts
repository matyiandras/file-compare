import jsPDF from 'jspdf';
export function renderToPDF(hunks) {
    console.log(hunks);
    var pdf = new jsPDF('p', 'pt', 'letter');

    if (!hunks || !hunks[0]) {
        return undefined;
    }

    hunks[0].changes.map((change, index) => {
        switch (change.type) {
            case 'insert':
                pdf.setTextColor(0, 255, 0);
                break;
            case 'delete':
                pdf.setTextColor(255, 0, 0);
                break;
            case 'normal':
                pdf.setTextColor(0, 0, 0);
                break;
            default:
                pdf.setTextColor(0, 0, 0);
                break;
        }
        pdf.text(change.content, 20, 20 * index + 30);
    });
    pdf.save('difference.pdf');
}