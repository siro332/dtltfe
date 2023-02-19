import React from 'react';
const Pagination = (props)=>{
    const { currentPage, maxPageLimit, minPageLimit} = props;
    const totalPages = props.response.totalPages-1;
    const data = props.response.data;
    const pages = [];
    for(let i=1 ; i<=totalPages; i++){
        pages.push(i);
    }
    return(
        <div>
        </div>
    )
}
export default Pagination;