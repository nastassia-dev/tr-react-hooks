import ImageToggleOnScroll from './ImageToggleOnScroll';
import useSpeakerDataManager from './useSpeakerDataManager';
import { useContext } from 'react';
import { GlobalContext } from './GlobalState';
import { FavoriteClickCountContext } from './FavoriteClickCountContext';

const SpeakerDetail = React.memo(({
  speakerRec,
  onHeartFavoriteHandler,
}) => {
  const { id, firstName, lastName, bio, favorite } = speakerRec;
  console.log(`SpeakerDetail:${id} ${firstName} ${lastName} ${favorite}`);
  // ***Each speaker gets its own independent state because of the instantiation below
  // const { favoriteClickCount, incrementFavoriteClickCount } = useSpeakerDataManager();

 //  const { favoriteClickCount: count, incrementFavoriteClickCount: incrementCount } = useContext(GlobalContext);
 // const { incrementFavoriteClickCount: incrementCount } = useContext(GlobalContext);
  const { incrementFavoriteClickCount: incrementCount } = useContext(FavoriteClickCountContext);

  return (
    <div className="card col-4 cardmin">
      <ImageToggleOnScroll
        className="card-img-top"
        primaryImg={`/static/speakers/bw/Speaker-${id}.jpg`}
        secondaryImg={`/static/speakers/Speaker-${id}.jpg`}
        alt="{firstName} {lastName}"
      />
      <div className="card-body">
        <h4 className="card-title">
          <button
            className={favorite ? 'heartredbutton' : 'heartdarkbutton'}
            onClick={(e) => {
              onHeartFavoriteHandler(e, speakerRec);
              incrementCount();
            }}
          />
          <span>
            {firstName} {lastName}
          </span>
        </h4>
        {/*<h5>Click count: {count}</h5>*/}
        <span>{bio}</span>
      </div>
    </div>
  );
});

export default SpeakerDetail;
