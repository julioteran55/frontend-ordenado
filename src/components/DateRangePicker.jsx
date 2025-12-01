import React from "react";

function DateRangePicker({ range, onChange }) {
  const handleFrom = (e) => onChange({ ...range, from: e.target.value });
  const handleTo = (e) => onChange({ ...range, to: e.target.value });

  return (
    <form className="date-range">
      <label>
        Desde
        <input type="date" value={range.from} onChange={handleFrom} />
      </label>
      <label>
        Hasta
        <input type="date" value={range.to} onChange={handleTo} />
      </label>
      <button type="button" className="btn-aplicar">Aplicar</button>
    </form>
  );
}

export default DateRangePicker;
