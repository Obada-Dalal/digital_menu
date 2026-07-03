import { IoSearchSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import "./search.css";

export default function Search({
  query,
  onChange,
  onClear,
  totalResults,
  isLoading
}) {
  const showMessage = query.trim().length > 0;

  // ✨ لو في loading للبحث كله
  if (isLoading) {
    return (
      <div className="search-container">
        <div className="search-box">
          <div className="search-skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-container">
      <div className={`search-box ${isLoading ? "searching" : ""}`}>
        <input
          type="text"
          placeholder="ابحث من هنا ... "
          value={query}
          onChange={(e) => onChange(e.target.value)}
        />
        {query && (
          <button className="clear-btn" onClick={onClear}>
            <IoClose />
          </button>
        )}
        <i className="search-icon">
          <IoSearchSharp />
        </i>
      </div>

      {showMessage && (
        <div className="search-results-header">
          {totalResults > 0
            ? ` ${totalResults} صنف موجود لـ "${query}"`
            : ` لم يتم العثور على أصناف لـ "${query}"`}
        </div>
      )}
    </div>
  );
}
