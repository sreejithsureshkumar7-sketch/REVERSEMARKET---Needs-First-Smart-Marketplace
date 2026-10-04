import jsPDF from 'jspdf';
import { Requirement, Offer } from '../types';

export function exportComparisonPdf(requirement: Requirement, offers: Offer[], bestOffer?: Offer) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('REVERSEMARKET', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Needs-First Smart Marketplace | Verified Evaluation Report', 14, 18);

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - 14, 18, { align: 'right' });

  y = 36;

  // Requirement Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, pageWidth - 28, 38, 2, 2, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(`Requirement: ${requirement.title}`, 18, y + 8);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Category: ${requirement.category}  |  Target Budget: INR ${requirement.budget.toLocaleString('en-IN')}  |  Max Deadline: ${requirement.deadlineDays} Days`, 18, y + 16);
  doc.text(`Required Skills: ${requirement.requiredSkills.join(', ')}`, 18, y + 23);
  doc.text(`Status: ${requirement.status.toUpperCase()}  |  Total Offers Received: ${offers.length}`, 18, y + 30);

  y += 46;

  // Best Match & Savings Highlight
  if (bestOffer) {
    const savings = Math.max(0, requirement.budget - bestOffer.price);
    const savingsPct = Math.round((savings / requirement.budget) * 100);

    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(14, y, pageWidth - 28, 26, 2, 2, 'FD');

    doc.setTextColor(21, 128, 61);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`★ TOP RECOMMENDATION: ${bestOffer.providerName} (${bestOffer.matchScore}% Match Score)`, 18, y + 7);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(22, 101, 52);
    doc.text(`Offered Price: INR ${bestOffer.price.toLocaleString('en-IN')}  |  Delivery: ${bestOffer.deliveryDays} Days  |  Trust Score: ${bestOffer.providerTrustScore}/100`, 18, y + 14);
    doc.text(`Estimated Buyer Savings: INR ${savings.toLocaleString('en-IN')} (${savingsPct}% below target budget)`, 18, y + 21);

    y += 34;
  }

  // Comparison Table Header
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Provider Offers Comparison Matrix', 14, y);
  y += 5;

  // Table Columns: Provider, Price, Delivery, Relevance, Trust Score, Match Score, Savings
  const colX = [14, 52, 78, 102, 128, 154, 178];
  const colW = [38, 26, 24, 26, 26, 24, 18];

  // Header row
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);

  doc.text('Provider', colX[0] + 2, y + 5.5);
  doc.text('Price (INR)', colX[1] + 2, y + 5.5);
  doc.text('Delivery', colX[2] + 2, y + 5.5);
  doc.text('Relevance', colX[3] + 2, y + 5.5);
  doc.text('Trust Score', colX[4] + 2, y + 5.5);
  doc.text('Match %', colX[5] + 2, y + 5.5);
  doc.text('Saved', colX[6] + 2, y + 5.5);

  y += 8;

  // Table Rows
  doc.setFont('helvetica', 'normal');
  offers.forEach((offer, idx) => {
    const isTop = bestOffer?.id === offer.id;
    if (isTop) {
      doc.setFillColor(240, 253, 244);
      doc.rect(14, y, pageWidth - 28, 9, 'F');
    } else if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, pageWidth - 28, 9, 'F');
    }

    doc.setDrawColor(241, 245, 249);
    doc.line(14, y + 9, pageWidth - 14, y + 9);

    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);

    const nameText = `${offer.providerName}${isTop ? ' ★' : ''}`;
    doc.text(nameText.slice(0, 20), colX[0] + 2, y + 6);
    doc.text(`₹${offer.price.toLocaleString('en-IN')}`, colX[1] + 2, y + 6);
    doc.text(`${offer.deliveryDays} days`, colX[2] + 2, y + 6);
    doc.text(`${offer.scoreBreakdown.relevance}%`, colX[3] + 2, y + 6);
    doc.text(`${offer.providerTrustScore}/100`, colX[4] + 2, y + 6);

    // Match score bold
    doc.setFont('helvetica', 'bold');
    if (isTop) doc.setTextColor(22, 101, 52);
    doc.text(`${offer.matchScore}%`, colX[5] + 2, y + 6);

    const saved = requirement.budget - offer.price;
    doc.setFont('helvetica', 'normal');
    if (saved >= 0) {
      doc.setTextColor(22, 101, 52);
      doc.text(`+₹${saved.toLocaleString('en-IN')}`, colX[6] + 2, y + 6);
    } else {
      doc.setTextColor(185, 28, 28);
      doc.text(`-₹${Math.abs(saved).toLocaleString('en-IN')}`, colX[6] + 2, y + 6);
    }

    y += 9;
  });

  y += 10;

  // Matching Engine Criteria Breakdown
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, pageWidth - 28, 40, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Smart Matching Scoring Weights (PS 1 Standard)', 18, y + 7);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('• Budget Compatibility (30%): How closely provider pricing fits user target budget.', 18, y + 14);
  doc.text('• Deadline Compatibility (25%): Turnaround capability vs required delivery timeframe.', 18, y + 20);
  doc.text('• Requirement Relevance (30%): Skill overlap and technical deliverable alignment.', 18, y + 26);
  doc.text('• Provider Experience (10%): Verified years in domain and past deliverables.', 18, y + 32);
  doc.text('• Provider Trust Score (5%): Average rating (40%), completed projects (25%), response time (20%), verification (15%).', 18, y + 38);

  // Footer
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('ReverseMarket Hackathon Project | Built with React, Vite & Smart Reverse Bidding Engine', pageWidth / 2, 288, { align: 'center' });

  // Download trigger
  const filename = `ReverseMarket_${requirement.title.replace(/[^a-zA-Z0-9]/g, '_')}_Comparison.pdf`;
  doc.save(filename);
}
