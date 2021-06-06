import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Photo from "./Photo";
const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`;
const mainUrl = `https://api.unsplash.com/photos/`;
const searchUrl = `https://api.unsplash.com/search/photos/`;

function App() {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const fetchImages = async () => {
    setLoading(true);
    let url;
    const pageId = `&page=${page}`;
    const queryParams = `&query=${query}`;
    try {
      if (query.length > 0) {
        url = `${searchUrl}${clientID}${pageId}${queryParams}`;
      } else {
        url = `${mainUrl}${clientID}${pageId}`;
      }
      const result = await fetch(url);
      const response = await result.json();
      console.log(response);
      setImages((prevImages) => {
        if (query.length > 0) {
          if (page === 1) {
            return response.results;
          }
          return [...prevImages, ...response.results];
        } else {
          return [...prevImages, ...response];
        }
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [page]);

  useEffect(() => {
    const event = window.addEventListener("scroll", () => {
      if (
        !loading &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 5
      ) {
        setPage((prevpage) => prevpage + 1);
      }
    });
    return () => window.removeEventListener("scroll", event);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <main>
      <section className="search">
        <form action="" className="search-form">
          <input
            type="text"
            className="form-input"
            placeholder="search"
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="submit-btn" type="submit" onClick={(e) => handleSubmit(e)}>
            <FaSearch />
          </button>
        </form>
      </section>
      <section className="photos">
        <div className="photos-center">
          {images.length > 0 &&
            images.map((image, index) => {
              console.log(image);
              return <Photo key={index} {...image} />;
            })}
        </div>
      </section>
    </main>
  );
}

export default App;
