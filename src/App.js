import React, { useState } from "react";
import useSWR from "swr";
import useStickyState from "./useStickyState";
import "./App.css";
import { SearchIcon, XIcon, SpeakerphoneIcon } from "@heroicons/react/solid";
import FadeIn from "./FadeIn";

const fetcher = (url) => fetch(url).then((res) => res.json());

function App() {
  const [title, setTitle] = useState();
  const [nominated, setNominated] = useStickyState([]);
  const { data, isLoading } = useSWR(
    `https://www.omdbapi.com/?s=${title}&apikey=4e946f65&type=movie`,
    fetcher
  );

  const addNomination = (item) => {
    setNominated([...nominated, item]);
  };

  const removeNomination = (toRemove) => {
    let temp = [];
    for (let i = 0; i < nominated.length; i++) {
      if (!(nominated[i].imdbID === toRemove.imdbID)) {
        temp.push(nominated[i]);
      }
    }
    setNominated(temp);
  };

  const isNominated = (toCheck) => {
    let found = false;
    for (var i = 0; i < nominated.length; i++) {
      if (nominated[i].imdbID === toCheck.imdbID) {
        found = true;
        break;
      }
    }
    return found;
  };

  return (
    <main className="App bg-indigo-300">
      {nominated.length >= 5 && (
        <div className="bg-indigo-600 fixed w-full">
          <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between flex-wrap">
              <div className="w-0 flex-1 flex items-center">
                <span className="flex p-2 rounded-lg bg-indigo-800">
                  <SpeakerphoneIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
                <p className="ml-3 font-medium text-white truncate">
                  <span className="md:hidden">We announced a new product!</span>
                  <span className="hidden md:inline">
                    Big news! You have nominated more than 5 movies. Congratulations!
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto bg-white px-8 py-8 rounded-xl">
          <div className="pb-6">
            <h1 className="text-3xl font-bold text-indigo-800">OMDb Nominator!</h1>
          </div>

          {nominated.length > 0 && (
            <section className="pb-12">
              <h2 className="text-indigo-700 text-xl font-medium pt-6 pb-2">Your Nominations!</h2>
              <div className="parent">
                {nominated.map((item) => (
                  <FadeIn className="child flex flex-col items-center border-indigo-600 border-2 px-2 py-2 rounded-md">
                    <button
                      className="flex border-red-600 border-2 rounded-lg px-2 mb-1"
                      onClick={() => removeNomination(item)}
                    >
                      <XIcon className="h-5 w-5 text-red-600" />{" "}
                      <p className="text-red-600 text-sm">Remove</p>
                    </button>
                    <img src={item.Poster} alt={`Poster for ${item.Title}`} />
                    <p className="text-center text-indigo-600 font-medium mt-2">{item.Title}</p>
                    <p className="text-center text-indigo-600">({item.Year})</p>
                  </FadeIn>
                ))}
              </div>
            </section>
          )}

          <div>
            <label htmlFor="search" className="block text-sm font-medium text-indigo-600">
              Search for a movie...
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md text-indigo-900"
                placeholder="Search for a movie..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          {isLoading || !data ? (
            <div className="flex items-center mt-6">
              <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mr-4"></div>
              <h2 className="text-center text-xl font-semibold text-indigo-700 mr-4">Loading...</h2>
              <p className="text-center text-indigo-600">
                This may take a few seconds, please don't close this page.
              </p>
            </div>
          ) : (
            <div>
              {title && data.Response === "True" ? (
                <div className="pt-4 pb-2">
                  <h3 className="text-indigo-700 text-xl font-medium">Results for... "{title}"</h3>
                  <h4 className="text-indigo-500 text-base font-normal">
                    {data.Search.length} of {data.totalResults} total results
                  </h4>
                </div>
              ) : (
                <h3 className="text-indigo-700 text-xl font-medium pt-6 pb-2">{data.Error}</h3>
              )}
              <section>
                {title &&
                  data.Search &&
                  data.Search.map((result, index) => {
                    console.log(index);
                    return (
                      <FadeIn duration={300 * index} delay={100 * index}>
                        <div
                          key={`${result.imdbID}${title}`}
                          className="my-2 px-4 h-24 flex justify-between border-indigo-600 border-2 rounded-md items-center"
                        >
                          <img
                            src={result.Poster}
                            alt={`Poster for ${result.Title}`}
                            width="50"
                            className="inline"
                          />{" "}
                          <p className="inline">
                            {result.Title} ({result.Year})
                          </p>
                          <button
                            className={`h-10 float-right inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md ${
                              isNominated(result)
                                ? `text-gray-400 bg-gray-200 hover:bg-gray-100`
                                : `text-white bg-indigo-600 hover:bg-indigo-700`
                            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                            type="button"
                            onClick={() => {
                              if (!isNominated(result)) {
                                addNomination(result);
                              }
                            }}
                          >
                            Nominate!
                          </button>
                        </div>
                      </FadeIn>
                    );
                  })}
              </section>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
