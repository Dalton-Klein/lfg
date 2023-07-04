import FooterComponent from "../nav/footerComponent";
import "./rankPage.scss";
import { useLocation, useNavigate } from "react-router-dom";
import BannerTitle from "../nav/banner-title";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { getUserRankProgression } from "../../utils/rest";
import RankTile from "../tiles/rankTile";
import { updateUserThunk } from "../../store/userSlice";

export default function RankPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast: any = useRef({ current: "" });
  const locationPath: string = useLocation().pathname;
  const userState = useSelector((state: RootState) => state.user.user);
  const topOfPageRef: any = useRef(null);
  const [progressionStats, setprogressionStats] = useState<any>({
    grandTotal: 0,
    1: {
      count: 0,
      total: 0,
    },
    2: {
      count: 0,
      total: 0,
    },
    3: {
      count: 0,
      total: 0,
    },
    4: {
      count: 0,
      total: 0,
    },
    5: {
      count: 0,
      total: 0,
    },
    6: {
      count: 0,
      total: 0,
    },
    7: {
      count: 0,
      total: 0,
    },
    8: {
      count: 0,
      total: 0,
    },
    9: {
      count: 0,
      total: 0,
    },
    10: {
      count: 0,
      total: 0,
    },
    11: {
      count: 0,
      total: 0,
    },
    12: {
      count: 0,
      total: 0,
    },
    13: {
      count: 0,
      total: 0,
    },
    14: {
      count: 0,
      total: 0,
    },
    15: {
      count: 0,
      total: 0,
    },
  });
  const scrollToSection = (ref: any) => {
    ref.current?.scrollIntoView();
  };

  useEffect(() => {
    dispatch(updateUserThunk(userState.id));
    scrollToSection(topOfPageRef);
    getProgresion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPath]);

  const getProgresion = async () => {
    let result = await getUserRankProgression(userState.id);
    if (result?.data) {
      result = result.data;
    } else result = [];
    let formattedResult = { grandTotal: 0 };
    result.forEach((rec) => {
      formattedResult.grandTotal = formattedResult.grandTotal + rec.points;
      if (formattedResult[rec.redeem_type_id]) {
        formattedResult[rec.redeem_type_id].count = formattedResult[rec.redeem_type_id].count + 1;
        formattedResult[rec.redeem_type_id].total = rec.points + formattedResult[rec.redeem_type_id].total;
      } else {
        formattedResult[rec.redeem_type_id] = {
          count: 1,
          pointsPer: rec.points,
          total: rec.points,
        };
      }
    });
    setprogressionStats({ ...progressionStats, ...formattedResult });
  };

  return (
    <div className="rank-page-master" ref={topOfPageRef}>
      <Toast ref={toast} />
      <BannerTitle
        title={"my rank progression"}
        imageLink={"https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"}
      ></BannerTitle>
      <div className="rank-progression-container">
        <div className="back-container">
          <button
            className="back-button"
            onClick={() => {
              navigate("/general-profile");
            }}
          >
            &nbsp; general profile &nbsp;
          </button>
        </div>
        <div className="gradient-bar"></div>
        {/* Welcome */}
        <div className="rank-section-container">
          <div className="rank-section-title">rank & prestige</div>
          <div className="rank-my-details">
            <div className="rank-my-details-rankwidget">
              <RankTile user={userState} isSmall={false}></RankTile>
            </div>
            <div className="rank-my-details-progress">
              <div className="rank-stat-row">
                <div>prestige: </div>
                <div>{Math.floor(progressionStats.grandTotal / 25)}</div>
              </div>
              <div className="rank-stat-row">
                <div>rank: </div>
                <div>
                  {Math.floor(
                    (progressionStats.grandTotal < 25
                      ? progressionStats.grandTotal
                      : progressionStats.grandTotal % 25) /
                      5 +
                      1
                  )}
                </div>
              </div>
              <div className="rank-stat-row">
                <div>total:</div>
                <div>{progressionStats.grandTotal} pts</div>
              </div>
              <div className="rank-stat-row">
                <div>next rank: </div>
                <div>{5 - (progressionStats.grandTotal % 5)} pts</div>
              </div>
              <div className="rank-stat-row">
                <div>next prestige: </div>
                <div>{25 - (progressionStats.grandTotal % 25)} pts</div>
              </div>
            </div>
          </div>
          <div className="rank-explanation">
            Your rank and prestige represent the amount of activity, reliability, and reputation you carry on the gangs
            platform.
          </div>
          <br />
          <div className="rank-explanation">
            You can rank up by completing a number of challenges across the platform and monitor your progres here.
          </div>
          <br />
          <div className="rank-explanation">Every 5 points you go up one rank and receive an additional star.</div>
          <br />
          <div className="rank-explanation">
            Every 25 points will result in moving up one prestige level. This will change the color of your ranking.
          </div>
        </div>
        <div className="gradient-bar"></div>
        <div className="rank-section-container">
          <div className="rank-section-title">my progression</div>
          <div className="rank-progress-container">
            <div className="rank-progress-grid-header">challenge</div>
            <div className="rank-progress-grid-header">redemptions</div>
            <div className="rank-progress-grid-header">points per </div>
            <div className="rank-progress-grid-header">your total </div>
          </div>
          <div className="rank-progress-container rank-challenge">
            <div className="rank-progress-subtitle">signup</div>
            <div className="rank-progress-tracker">{progressionStats ? progressionStats[1].count : 0} / 1</div>
            <div className="rank-progress-tally">1 pts</div>
            <div className="rank-progress-tally">{progressionStats ? progressionStats[1].total : 0} pts</div>
          </div>
          <div className="rank-progress-container rank-challenge">
            <div className="rank-progress-subtitle">profile complete</div>
            <div className="rank-progress-tracker">{progressionStats ? progressionStats[2].count : 0} / 1</div>
            <div className="rank-progress-tally">1 pts</div>
            <div className="rank-progress-tally">{progressionStats ? progressionStats[2].total : 0} pts</div>
          </div>
          <div className="rank-progress-container rank-challenge">
            <div className="rank-progress-subtitle">go public</div>
            <div className="rank-progress-tracker">{progressionStats ? progressionStats[3].count : 0} / 1</div>
            <div className="rank-progress-tally">1 pts</div>
            <div className="rank-progress-tally">{progressionStats ? progressionStats[3].total : 0} pts</div>
          </div>
          <div className="rank-progress-container rank-challenge">
            <div className="rank-progress-subtitle">buddy up</div>
            <div className="rank-progress-tracker">{progressionStats ? progressionStats[4].count : 0} / 10</div>
            <div className="rank-progress-tally">3 pts</div>
            <div className="rank-progress-tally">{progressionStats ? progressionStats[4].total : 0} pts</div>
          </div>
          <div className="rank-progress-container rank-challenge">
            <div className="rank-progress-subtitle">report for duty</div>
            <div className="rank-progress-tracker">{progressionStats ? progressionStats[5].count : 0} / 10</div>
            <div className="rank-progress-tally">3 pts</div>
            <div className="rank-progress-tally">{progressionStats ? progressionStats[5].total : 0} pts</div>
          </div>
          <div className="rank-progress-container rank-challenge">
            <div className="rank-progress-subtitle">recruiter</div>
            <div className="rank-progress-tracker">{progressionStats ? progressionStats[6].count : 0} / 10</div>
            <div className="rank-progress-tally">3 pts</div>
            <div className="rank-progress-tally">{progressionStats ? progressionStats[6].total : 0} pts</div>
          </div>
          <div className="rank-progress-container rank-challenge">
            <div className="rank-progress-subtitle">critic</div>
            <div className="rank-progress-tracker">{progressionStats ? progressionStats[7].count : 0} / 10</div>
            <div className="rank-progress-tally">1 pts</div>
            <div className="rank-progress-tally">{progressionStats ? progressionStats[7].total : 0} pts</div>
          </div>
          <div className="rank-progress-container rank-challenge">
            <div className="rank-progress-subtitle">avid gamer</div>
            <div className="rank-progress-tracker">{progressionStats ? progressionStats[8].count : 0} / unlimited</div>
            <div className="rank-progress-tally">1 pts</div>
            <div className="rank-progress-tally">{progressionStats ? progressionStats[8].total : 0} pts</div>
          </div>
          <div className="rank-progress-container rank-challenge">
            <div className="rank-progress-subtitle">good comms</div>
            <div className="rank-progress-tracker">{progressionStats ? progressionStats[9].count : 0} / unlimited</div>
            <div className="rank-progress-tally">1 pts</div>
            <div className="rank-progress-tally">{progressionStats ? progressionStats[9].total : 0} pts</div>
          </div>
          <div className="rank-progress-container rank-challenge">
            <div className="rank-progress-subtitle">gang leader</div>
            <div className="rank-progress-tracker">{progressionStats ? progressionStats[10].count : 0} / 2</div>
            <div className="rank-progress-tally">5 pts</div>
            <div className="rank-progress-tally">{progressionStats ? progressionStats[10].total : 0} pts</div>
          </div>
          <div className="rank-progress-container rank-challenge">
            <div className="rank-progress-subtitle rank-total-text">grand total</div>
            <div className="rank-progress-tracker"></div>
            <div className="rank-progress-tally"></div>
            <div className="rank-progress-tally rank-total-text">
              {progressionStats ? progressionStats.grandTotal : 0} pts
            </div>
          </div>
        </div>
        <div className="gradient-bar"></div>
        <div className="rank-section-container">
          <div className="rank-section-title">challenge details</div>
          <div className="rank-challenge-subtitle">signup</div>
          <div className="rank-challenge-details">Awarded for signing up for the gangs platform!</div>
          <div className="rank-challenge-subtitle">profile complete</div>
          <div className="rank-challenge-details">Awarded for completing all fields in your general profile.</div>
          <div className="rank-challenge-subtitle">go public</div>
          <div className="rank-challenge-details">
            Awarded for publishing a game profile. Must first fill out profile in order to publish
          </div>
          <div className="rank-challenge-subtitle">buddy up</div>
          <div className="rank-challenge-details">
            Awarded for adding adding a new friend. Awared when request is accepted.
          </div>
          <div className="rank-challenge-subtitle">report for duty</div>
          <div className="rank-challenge-details">Awarded for joining an existing gang (that you don't own).</div>
          <div className="rank-challenge-subtitle">recruiter</div>
          <div className="rank-challenge-details">Awarded for someone joining a gang that you own.</div>
          <div className="rank-challenge-subtitle">critic</div>
          <div className="rank-challenge-details">Awarded for leaving an endorsement on a players profile.</div>
          <div className="rank-challenge-subtitle">avid gamer</div>
          <div className="rank-challenge-details">
            Awarded at most once per day for using the gangs platform in some way.
          </div>
          <div className="rank-challenge-subtitle">good comms</div>
          <div className="rank-challenge-details">
            Awarded at most once per day for sending a group or private message in the gangs platform.
          </div>
          <div className="rank-challenge-subtitle">gang leader</div>
          <div className="rank-challenge-details">Awarded for creating a new gang.</div>
        </div>
        <div className="gradient-bar"></div>
        <div className="rank-section-container">
          <div className="rank-section-title">prestige details</div>
          <div className="rank-challenge-subtitle">prestige 0</div>
          <div className="rank-challenge-details rank-challenge-grey">grey</div>
          <div className="rank-challenge-subtitle">prestige 1</div>
          <div className="rank-challenge-details rank-challenge-white">white</div>
          <div className="rank-challenge-subtitle">prestige 2</div>
          <div className="rank-challenge-details rank-challenge-blue">blue</div>
          <div className="rank-challenge-subtitle">prestige 3</div>
          <div className="rank-challenge-details rank-challenge-red">red</div>
          <div className="rank-challenge-subtitle">prestige 4</div>
          <div className="rank-challenge-details rank-challenge-purple">purple</div>
          <div className="rank-challenge-subtitle">prestige 5</div>
          <div className="rank-challenge-details rank-challenge-green">green</div>
          <div className="rank-challenge-subtitle">prestige 6</div>
          <div className="rank-challenge-details rank-challenge-gold">gold</div>
        </div>
      </div>
      &nbsp; &nbsp;
    </div>
  );
}
