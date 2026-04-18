"use client";

export default function FilterBar({ setFilter }: any) {
  return (
    <div style={{ padding: "10px 40px" }}>
      <select onChange={(e) => setFilter(e.target.value)}>
        <option value="">Sort</option>
        <option value="low">Low → High</option>
        <option value="high">High → Low</option>
      </select>
    </div>
  );
}