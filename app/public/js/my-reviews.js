// app/public/js/my-reviews.js

const reviewsList = document.getElementById('reviews-list');
const statusEl = document.getElementById('status');
const editPanel = document.getElementById('edit-panel');
const editProduct = document.getElementById('edit-product');
const editRating = document.getElementById('edit-rating');
const editText = document.getElementById('edit-text');
const editError = document.getElementById('edit-error');
const editSuccess = document.getElementById('edit-success');
const saveEditBtn = document.getElementById('save-edit');
const cancelEditBtn = document.getElementById('cancel-edit');

let editingReviewId = null;
let reviewsCache = [];

function showStatus(message, type = 'info') {
  if (!statusEl) return;
  statusEl.textContent = message;
  if (type === 'error') {
    statusEl.style.background = '#fee';
    statusEl.style.color = '#900';
  } else {
    statusEl.style.background = '#eef';
    statusEl.style.color = '#006';
  }
}

function clearStatus() {
  if (!statusEl) return;
  statusEl.textContent = '';
  statusEl.style.background = 'transparent';
  statusEl.style.color = 'inherit';
}

function showEditError(message) {
  if (!editError) return;
  editError.textContent = message;
  editError.style.display = 'block';
  if (editSuccess) editSuccess.style.display = 'none';
}

function showEditSuccess(message) {
  if (!editSuccess) return;
  editSuccess.textContent = message;
  editSuccess.style.display = 'block';
  if (editError) editError.style.display = 'none';
}

function hideEditPanel() {
  if (!editPanel) return;
  editingReviewId = null;
  editPanel.style.display = 'none';
  if (editError) editError.style.display = 'none';
  if (editSuccess) editSuccess.style.display = 'none';
}

function openEditPanel(review) {
  if (!review || !editPanel) return;
  editingReviewId = review.ReviewID;
  editProduct.value = review.ProductName || '';
  editRating.value = review.Rating || 1;
  editText.value = review.ProductReview || '';
  editError.style.display = 'none';
  editSuccess.style.display = 'none';
  editPanel.style.display = 'block';
  editRating.focus();
}

function renderReviews(reviews) {
  if (!reviewsList) return;
  reviewsCache = Array.isArray(reviews) ? reviews : [];
  reviewsList.innerHTML = '';

  if (!reviewsCache.length) {
    showStatus('You have no reviews yet.');
    return;
  }

  clearStatus();

  reviewsCache.forEach((review) => {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <h3>${review.ProductName || 'Unknown product'}</h3>
      <p><strong>Rating:</strong> ${review.Rating ?? 'N/A'}</p>
      <p>${(review.ProductReview || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      <div class="actions">
        <button type="button" class="edit-btn" data-id="${review.ReviewID}">Edit</button>
        <button type="button" class="delete-btn" data-id="${review.ReviewID}">Delete</button>
      </div>
    `;

    reviewsList.appendChild(card);
  });

  reviewsList.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const selected = reviewsCache.find((r) => r.ReviewID === id);
      if (!selected) {
        showStatus('Review not found', 'error');
        return;
      }
      openEditPanel(selected);
    });
  });

  reviewsList.querySelectorAll('.delete-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const id = btn.dataset.id;
    await deleteReview(id);
  });
});
}

async function loadMyReviews() {
  showStatus('Loading your reviews...');
  try {
    const response = await fetch('/api/my-reviews');
    const data = await response.json();
    if (!response.ok || !data.success) {
      showStatus(data.message || 'Failed to load reviews', 'error');
      return;
    }
    renderReviews(data.reviews);
  } catch (error) {
    showStatus('Unable to load reviews: ' + error.message, 'error');
  }
}

async function saveEdit() {
  if (!editingReviewId) {
    showEditError('No review selected');
    return;
  }

  const rating = Number(editRating.value);
  const reviewText = editText.value.trim();

  
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    showEditError('Rating must be between 1 and 5.');
    return;
  }

  try {
    const response = await fetch(`/api/update_review/${editingReviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, review_text: reviewText })
    });

    const body = await response.json();
    if (!response.ok || !body.success) {
      showEditError(body.message || `Update failed (status ${response.status})`);
      return;
    }

    showEditSuccess('Review updated successfully.');
    await loadMyReviews();
    setTimeout(hideEditPanel, 900);
  } catch (error) {
    showEditError('Update failed: ' + error.message);
  }
}
async function deleteReview(reviewId) {
  if (!confirm('Are you sure you want to delete this review?')) return;
  
  try {
    const response = await fetch(`/api/delete_review/${reviewId}`, 
        { method: 'DELETE' });

    const body = await response.json();
    
    if (!response.ok || !body.success) {
      showStatus(body.message || `Delete failed (status ${response.status})`, 'error');
      return;
    }
    
    showStatus('Review deleted successfully.');
    await loadMyReviews();
  } catch (error) {
    showStatus('Delete failed: ' + error.message, 'error');
  } 
}
if (cancelEditBtn) cancelEditBtn.addEventListener('click', hideEditPanel);
if (saveEditBtn) saveEditBtn.addEventListener('click', saveEdit);

document.addEventListener('DOMContentLoaded', loadMyReviews);
