import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBenches, voteBench } from "../services/api";
import BenchCard from "../components/BenchCard";

export default function HomePage() {
  const [benches, setBenches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  useEffect(() => {
    loadBenches();
  }, [sort]);

  async function loadBenches(currentSearch = search, currentSort = sort) {
    try {
      setLoading(true);
      setError("");
      const data = await fetchBenches({
        search: currentSearch,
        sort: currentSort,
      });
      setBenches(data);
    } catch (err) {
      setError("Unable to load benches");
    } finally {
      setLoading(false);
    }
  }

  async function handleSearchSubmit(event) {
    event.preventDefault();
    loadBenches(search, sort);
  }

  async function handleVote(benchId, voteType) {
    try {
      await voteBench(benchId, {
        author_name: "Ali",
        vote_type: voteType,
      });

      loadBenches(search, sort);
    } catch (err) {
      setError("Unable to vote");
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>RateMyBench Feed</h2>
        <Link to="/add-bench">
          <button>Create Post</button>
        </Link>
      </div>

      <form onSubmit={handleSearchSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search benches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: "10px" }}
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option value="latest">Latest</option>
          <option value="top">Top</option>
        </select>

        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading benches...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && benches.length === 0 && (
        <p>No benches found.</p>
      )}

      {!loading && !error && benches.length > 0 && (
        <div>
          {benches.map((bench) => (
            <BenchCard key={bench.id} bench={bench} onVote={handleVote} />
          ))}
        </div>
      )}
    </div>
  );
}
