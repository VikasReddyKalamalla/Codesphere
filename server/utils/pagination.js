/**
 * Calculate pagination metadata
 * @param {Number} page - Current page (1-indexed)
 * @param {Number} limit - Items per page
 * @param {Number} totalCount - Total number of items
 * @returns {Object} { skip, totalPages, currentPage, hasNextPage, hasPrevPage }
 */
const getPagination = (page = 1, limit = 10, totalCount = 0) => {
  const currentPage = Math.max(1, parseInt(page));
  const itemsPerPage = Math.max(1, parseInt(limit));
  const skip = (currentPage - 1) * itemsPerPage;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return {
    skip,
    limit: itemsPerPage,
    currentPage,
    totalPages,
    totalCount,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

module.exports = { getPagination };
