const compactPagination = (currentPage: number, totalPages: number) => {
  const pages: (number | string)[] = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }
  
  pages.push(1, 2);
  
  if (currentPage <= 4) {
    pages.push(3, 4, '...', totalPages - 1, totalPages);
  } else if (currentPage >= totalPages - 3) {
    pages.push('...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push('...', currentPage, '...', totalPages - 1, totalPages);
  }

  return pages;
}

export default compactPagination;
