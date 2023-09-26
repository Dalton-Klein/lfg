import React, { useEffect, useState } from "react";
import "./rankTile.scss";

export default function RankTile({ user, isSmall }) {
  const [starImage, setstarImage] = useState<string>(
    "https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/silver_1_uyhthi.png"
  );
  const [arrangedStars, setarrangedStars] = useState<any>();
  const [prestigeRemainder, setprestigeRemainder] = useState<number>(0);
  useEffect(() => {
    const rankValue = parseInt(user.rank);
    const prestige = Math.floor(rankValue / 25);
    const prestigeRemainderValue = rankValue < 25 ? rankValue : rankValue % 25;
    setprestigeRemainder(prestigeRemainderValue);
    const caseValue = Math.floor(prestigeRemainderValue / 5);
    if (prestige === 0) {
      switch (caseValue) {
        case 0:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/silver_1_uyhthi.png");
          break;
        case 1:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152604/silver_2_fmfvkz.png");
          break;
        case 2:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152604/silver_3_tr4vzw.png");
          break;
        case 3:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152604/silver_4_piobwu.png");
          break;
        case 4:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152604/silver_5_xqk0f0.png");
          break;
      }
    } else if (prestige === 1) {
      switch (caseValue) {
        case 0:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152604/white_1_cpqpxs.png");
          break;
        case 1:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152604/white_2_cdn5ih.png");
          break;
        case 2:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152604/white_3_dwdtzl.png");
          break;
        case 3:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152604/white_4_px5jzl.png");
          break;
        case 4:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152604/white_5_iz4jun.png");
          break;
      }
    } else if (prestige === 2) {
      switch (caseValue) {
        case 0:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152602/blue_1_ixuuef.png");
          break;
        case 1:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152602/blue_2_keslna.png");
          break;
        case 2:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152602/blue_3_dncw4z.png");
          break;
        case 3:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152602/blue_4_qr1jeg.png");
          break;
        case 4:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152602/blue_5_goqv10.png");
          break;
      }
    } else if (prestige === 3) {
      switch (caseValue) {
        case 0:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/red_1_e4uxso.png");
          break;
        case 1:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/red_2_on4tet.png");
          break;
        case 2:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/red_3_hzcm7m.png");
          break;
        case 3:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/red_4_yz7xeh.png");
          break;
        case 4:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/red_5_gnftmw.png");
          break;
      }
    } else if (prestige === 4) {
      switch (caseValue) {
        case 0:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/purpe_1_mswfcr.png");
          break;
        case 1:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/purple_2_gpprfz.png");
          break;
        case 2:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/purple_3_tk3tud.png");
          break;
        case 3:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/purple_4_g74dfc.png");
          break;
        case 4:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/purple_5_wtmf0c.png");
          break;
      }
    } else if (prestige === 5) {
      switch (caseValue) {
        case 0:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152602/green_1_flb5ox.png");
          break;
        case 1:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152602/green_2_tqp04w.png");
          break;
        case 2:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/green_3_y9u5ar.png");
          break;
        case 3:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/green_4_qqb1q5.png");
          break;
        case 4:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/green_5_tay3rg.png");
          break;
      }
    } else if (prestige === 6) {
      switch (caseValue) {
        case 0:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152602/gold_1_em5oa2.png");
          break;
        case 1:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152602/gold_2_ksg9ou.png");
          break;
        case 2:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152603/gold_3_phbu5g.png");
          break;
        case 3:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152602/gold_4_mix32x.png");
          break;
        case 4:
          setstarImage("https://res.cloudinary.com/kultured-dev/image/upload/v1688152602/gold_5_qskjpq.png");
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.rank]);

  useEffect(() => {
    renderRank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [starImage, prestigeRemainder]);

  const renderRank = () => {
    setarrangedStars(<img src={starImage} className={isSmall ? "rank reduced" : "rank"} alt="rank-of-user" />);
    return;
  };

  return <div className={isSmall ? "rank-widget reduced" : "rank-widget"}>{arrangedStars}</div>;
}
