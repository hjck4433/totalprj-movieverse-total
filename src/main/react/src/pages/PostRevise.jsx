import React, { useState, useEffect } from "react";
import { storage } from "../api/firebase";
import Button from "../util/Button";
import { useNavigate, useParams } from "react-router-dom";
import face from "../images/faceIcon/faceIcon7.png";
import { NewPostComp, RadioBox } from "../component/NewPost/NewPostStyle";
import basicImg from "../images/congrats.png";
import MemberApi from "../api/MemberApi";
import BoardApi from "../api/BoardApi";
import Modal from "../util/Modal";
import useTokenAxios from "../hooks/useTokenAxios";

const PostRevise = () => {
  // 게시판 리스트로 이동
  const navigate = useNavigate();
  const toGatherList = () => {
    navigate("/board/gather");
  };

  const [boardData, setBoardData] = useState("");
  const { postId } = useParams();
  const [memberInfo, setMemberInfo] = useState(null);
  const [regDate, setRegDate] = useState("");

  const fetchMemberDetail = async () => {
    const res = await MemberApi.getMemberDetail();
    if (res.data !== null) setMemberInfo(res.data);
  };
  const getMemberDetail = useTokenAxios(fetchMemberDetail);

  const fetchBoardData = async () => {
    console.log("API 요청 전");
    const res = await BoardApi.boardDetail(postId);
    console.log("API 요청 후 : ", res);
    if (res.data !== null) {
      setBoardData(res.data);
      // 여기에 set 쌓아요
      setSelCategory(res.data.categoryName);
      setSelGather(res.data.gatherType);
      setInputTitle(res.data.title);
      setInputContents(res.data.boardContent);
      setImgSrc(res.data.image);

      const toDate = new Date(res.data.regDate);
      setRegDate(toDate.toISOString().split("T")[0]);
    }
  };
  const getBoardData = useTokenAxios(fetchBoardData);

  useEffect(() => {
    getMemberDetail(); // 멤버 정보 가져옴
    getBoardData(); // 게시글 정보 가져옴
  }, []);

  // 카테고리 및 모임형식 관련
  const [selCategory, setSelCategory] = useState("");
  const [selGather, setSelGather] = useState("");

  const onCategoryChange = (e) => {
    setSelCategory(e.target.value);
  };
  const onGatherChange = (e) => {
    setSelGather(e.target.value);
  };

  const [inputTitle, setInputTitle] = useState("");
  const [inputContents, setInputContents] = useState("");
  const onInputTitleChange = (e) => {
    setInputTitle(e.target.value);
  };
  const onInputContentsChange = (e) => {
    setInputContents(e.target.value);
  };

  useEffect(() => {
    //선택에 따라 값 변경 확인하는 콘솔
    // console.log("Category : " + selCategory);
    // console.log("Gather : " + selGather);
    // 카테고리가 무비추천이면 장소 선택을 초기화
    if (selCategory === "무비추천") setSelGather("");
  }, [selCategory, selGather]);

  // useEffect(() => {
  //   console.log("title : " + inputTitle);
  //   console.log("contents : " + inputContents);
  // }, [inputTitle, inputContents]);

  // 이미지 업로드
  const [imgSrc, setImgSrc] = useState(basicImg);
  const [file, setFile] = useState("");

  // 입력받은 이미지 파일 주소
  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files?.[0];

    // 선택된 파일이 있다면
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setImgSrc(objectUrl);
      // 파이어베이스에 보내기위해 변수에 저장
      setFile(selectedFile);
    }
  };

  // 모달
  const [openModal, setModalOpen] = useState(false);
  const closeModal = () => {
    setModalOpen(false);
    navigate(-1);
  };
  const [modalMsg, setModalMsg] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [modalType, setModalType] = useState(null);

  const handleModal = (header, msg, type) => {
    setModalOpen(true);
    setModalHeader(header);
    setModalMsg(msg);
    setModalType(type);
  };

  // 게시글 수정
  const updatePost = async (url) => {
    const res = await BoardApi.updateBoard(
      boardData.id,
      selCategory,
      selGather,
      inputTitle,
      url,
      inputContents
    );
    if (res.data) {
      console.log("저장 성공!");
      handleModal("성공", "수정이 완료되었습니다.", false);
    }
  };

  const onSubmit = () => {
    if (imgSrc !== basicImg && imgSrc !== boardData.image) {
      const storageRef = storage.ref();
      const fileRef = storageRef.child(file.name);
      fileRef.put(file).then(() => {
        console.log("저장성공!");
        fileRef.getDownloadURL().then((url) => {
          console.log("저장경로 확인 : " + url);
          console.log("url" + url);
          updatePost(url);
        });
      });
    } else {
      updatePost();
    }
  };
  const clickSave = useTokenAxios(onSubmit);

  return (
    <>
      <NewPostComp>
        <div className="container">
          <div className="bubbleArea">
            <img className="faceIcon" src={face} alt="Icon" />
            <div className="bubbleText">
              <h2>게시글을 등록해 볼까요?</h2>
              <p>
                무비 모임을 열어서 함께 영화도 보고, 모임 후기도 남겨보세요!
              </p>
              <p>
                나의 인생 영화, 추천 영화도 공유하며 새로운 취향도 찾아보아요~
              </p>
            </div>
          </div>
          <div className="postBox">
            <div className="selectBoard">
              <h3>게시판 선택</h3>
              <RadioBox>
                {/* name 부분이 같아야 함 */}
                <div className="boardSelectBtn">
                  <label className="boardLable1" htmlFor="무비모임">
                    <input
                      type="radio"
                      id="무비모임"
                      value="무비모임"
                      name="category"
                      onChange={onCategoryChange}
                      checked={selCategory === "무비모임" ? "checked" : ""}
                    />
                    무비모임
                  </label>
                  <label className="boardLable2" htmlFor="모임후기">
                    <input
                      type="radio"
                      id="모임후기"
                      value="모임후기"
                      name="category"
                      onChange={onCategoryChange}
                      checked={selCategory === "모임후기" ? "checked" : ""}
                    />
                    모임후기
                  </label>
                  <label className="boardLable3" htmlFor="무비추천">
                    <input
                      type="radio"
                      id="무비추천"
                      value="무비추천"
                      name="category"
                      onChange={onCategoryChange}
                      checked={selCategory === "무비추천" ? "checked" : ""}
                    />
                    무비추천
                  </label>
                </div>
              </RadioBox>
            </div>
            <div className="meetingMethod">
              <h3>장 소</h3>
              <RadioBox>
                <div className="placeSelectBtn">
                  <label className="placeLable1" htmlFor="온라인">
                    <input
                      type="radio"
                      id="온라인"
                      value="온라인"
                      name="gather"
                      onChange={onGatherChange}
                      disabled={selCategory === "무비추천" ? true : false}
                      checked={selGather === "온라인" ? "checked" : ""}
                    />
                    온라인
                  </label>
                  <label className="placeLable2" htmlFor="오프라인">
                    <input
                      type="radio"
                      id="오프라인"
                      value="오프라인"
                      name="gather"
                      onChange={onGatherChange}
                      disabled={selCategory === "무비추천" ? true : false}
                      checked={selGather === "오프라인" ? "checked" : ""}
                    />
                    오프라인
                  </label>
                </div>
              </RadioBox>
            </div>
            <div className="writer">
              <h3>작성자</h3>
              <p>{memberInfo && memberInfo.alias}</p>
            </div>
            <div className="uploadDate">
              <h3>작성일</h3>
              <p>{regDate}</p>
            </div>
            <div className="postTitle">
              <h3>제 목</h3>
              <textarea
                type="text"
                value={inputTitle}
                placeholder="모임 제목을 입력해주세요"
                onChange={onInputTitleChange}
              ></textarea>
            </div>
            <div className="uploadImg">
              <h3>이미지</h3>
              <div className="boardImg">
                <div className="imgBox">
                  <img src={imgSrc} alt="게시글 내용 이미지" />
                </div>
                <label>
                  <input
                    type="file"
                    onChange={(e) => handleFileInputChange(e)}
                  />
                  파일 선택
                </label>
              </div>
            </div>
            <div className="contents">
              <h3>내 용</h3>
              <textarea
                type="text"
                value={inputContents}
                placeholder="모임내용을 입력해주세요"
                onChange={onInputContentsChange}
              ></textarea>
            </div>
            <div className="buttonBox">
              <Button
                children="수정하기"
                active={true}
                back="var(--BLUE)"
                clickEvt={clickSave}
              />
              <Button
                children="목록보기"
                active={true}
                front="var(--VIOLET)"
                back="var(--BLUE)"
                clickEvt={toGatherList}
              />
            </div>
          </div>
        </div>
      </NewPostComp>
      <Modal
        open={openModal}
        close={closeModal}
        header={modalHeader}
        children={modalMsg}
        type={modalType}
      />
    </>
  );
};
export default PostRevise;
