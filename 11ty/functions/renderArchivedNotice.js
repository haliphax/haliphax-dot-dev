const renderArchivedNotice = tags => {
	if (!tags.includes('archived')) {
		return '';
	}

	return /*html*/`
		<div class="archived-notice alert alert-primary mb-10" role="contentinfo">
			<small>
				<i class="fas fa-exclamation-triangle"></i>
				This content has been <strong>archived</strong>. Its subject matter is
				no longer relevant. This URL will remain active indefinitely, but the
				content will not otherwise be listed on the site.
			</small>
		</div>
		`;
};

module.exports = renderArchivedNotice;
