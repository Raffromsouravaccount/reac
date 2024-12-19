import React from 'react';
import Pagination from '@material-ui/lab/Pagination';

export const PaginationComp = ({ showFirstButton, showLastButton, count, page, onChange }) => (
  <div className="pagination auto-pagination">
    <Pagination count={count} page={page} showFirstButton={showFirstButton}
      showLastButton={showLastButton} onChange={onChange} />
  </div>
);
