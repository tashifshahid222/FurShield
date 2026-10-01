import { Pagination } from './Pagination';

export const PaginatedList = ({ page, pages, onPageChange }) => {
  return <Pagination page={page} pages={pages} onPageChange={onPageChange} />;
};

export default PaginatedList;