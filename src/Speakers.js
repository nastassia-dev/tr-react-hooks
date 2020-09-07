import React, { useEffect, useState, useContext, useReducer, useCallback, useMemo } from 'react';
import axios from 'axios';

import { Header } from '../src/Header';
import { Menu } from '../src/Menu';
import SpeakerData from './SpeakerData';
import SpeakerDetail from './SpeakerDetail';
import { ConfigContext } from './App';
import speakersReducer from './speakersReducer';
import { GlobalContext } from './GlobalState';

const Speakers = ({}) => {
  const [speakingSaturday, setSpeakingSaturday] = useState(true);
  const [speakingSunday, setSpeakingSunday] = useState(true);
  const context = useContext(ConfigContext);

  function useSpeakerDataManager() {
    /**
     * We want to replace the state useReducer() is tracking to be an object containing multiple
     * properties rather than just one "speakerList" property
     *
     */
    const [{ isLoading, speakerList }, dispatch] = useReducer(speakersReducer, {
      isLoading: true,
      speakerList: []
    });
    // const [isLoading, setIsLoading] = useState(true);

    /**
     * Instead of exporting a reducer's dispatch function it is better to export a handler
     */
    function toggleSpeakerFavorite(speakerRec) {
      const updateData = async function() {
        axios.put(`http://localhost:4000/speakers/${speakerRec.id}`, speakerRec);
        speakerRec.favorite === true ?
          dispatch({ type: 'unfavorite', id: speakerRec.id })
          : dispatch({ type: 'favorite',  id: speakerRec.id });
      };
      updateData();
    }

    useEffect(() => {
     /* //  setIsLoading(true);
      new Promise(function (resolve) {
        setTimeout(function () {
          resolve();
        }, 1000);
      }).then(() => {
        //  setIsLoading(false);
        /!*   const speakerListServerFilter = SpeakerData.filter(({ sat, sun }) => {
             return (speakingSaturday && sat) || (speakingSunday && sun);
           });*!/
        // setSpeakerList(speakerListServerFilter);
        dispatch({
          type: 'setSpeakerList',
          data: SpeakerData, // speakerListServerFilter,
        });
      });*/
     const fetchData = async function() {
       let result = await axios.get('http://localhost:4000/speakers');
       dispatch({
         type: 'setSpeakerList',
         data: result.data,
       });
     };
     fetchData();

      return () => {
        console.log('cleanup');
      };
    }, []); // [speakingSunday, speakingSaturday]);

    return { isLoading, speakerList, toggleSpeakerFavorite }; // dispatch };
  }

  // const { isLoading, speakerList, toggleSpeakerFavorite } = useSpeakerDataManager();
  const { isLoading, speakerList, toggleSpeakerFavorite } = useContext(GlobalContext);
  const handleChangeSaturday = () => {
    setSpeakingSaturday(!speakingSaturday);
  };
  const handleChangeSunday = () => {
    setSpeakingSunday(!speakingSunday);
  };

  const heartFavoriteHandler = useCallback((e, speakerRec) => {
    e.preventDefault();
    // const sessionId = parseInt(e.target.attributes['data-sessionid'].value);
    /*    setSpeakerList(
          speakerList.map((item) => {
            if (item.id === sessionId) {
              return { ...item, favorite: favoriteValue };
            }
            return item;
          }),
        );*/
    /*dispatch({
      type: favoriteValue === true ? 'favorite' : 'unfavorite',
      id: sessionId,
    });*/
    toggleSpeakerFavorite(speakerRec);
    //console.log("changing session favorite to " + favoriteValue);
  }, []);

  const newSpeakerList = useMemo(() => speakerList
    .filter(
      ({ sat, sun }) =>
        (speakingSaturday && sat) || (speakingSunday && sun),
    )
    .sort(function (a, b) {
      if (a.firstName < b.firstName) {
        return -1;
      }
      if (a.firstName > b.firstName) {
        return 1;
      }
      return 0;
    }), [speakingSaturday, speakingSunday, speakerList]);

  const speakerListFiltered = isLoading
    ? []
    : newSpeakerList;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <Menu />
      <div className="container">
        <div className="btn-toolbar  margintopbottom5 checkbox-bigger">
          {context.showSpeakerSpeakingDays === false ? null :(
          <div className="hide">
            <div className="form-check-inline">
              <label className="form-check-label">
                <input
                  type="checkbox"
                  className="form-check-input"
                  onChange={handleChangeSaturday}
                  checked={speakingSaturday}
                />
                Saturday Speakers
              </label>
            </div>
            <div className="form-check-inline">
              <label className="form-check-label">
                <input
                  type="checkbox"
                  className="form-check-input"
                  onChange={handleChangeSunday}
                  checked={speakingSunday}
                />
                Sunday Speakers
              </label>
            </div>
          </div>
          )}
        </div>
        <div className="row">
          <div className="card-deck">
            {speakerListFiltered.map(
              (speakerRec) => {
                return (
                  <SpeakerDetail
                    key={speakerRec.id}
                    speakerRec={speakerRec}
                    onHeartFavoriteHandler={heartFavoriteHandler}
                  />
                );
              },
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speakers;
