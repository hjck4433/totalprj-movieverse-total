package com.totalprj.movieverse.controller;


import com.totalprj.movieverse.dto.AdminMemberDto;
import com.totalprj.movieverse.dto.MemberReqDto;
import com.totalprj.movieverse.dto.MemberResDto;
import com.totalprj.movieverse.security.SecurityUtil;
import com.totalprj.movieverse.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;


@RestController
@Slf4j
@RequestMapping("/member")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;
    // 회원 상세 조회
    @GetMapping("/detail")
    public ResponseEntity<MemberResDto> memberDetail(){
        Long id = SecurityUtil.getCurrentMemberId();
        log.info("id : {} ", id);
        MemberResDto memberResDto = memberService.getMemberDetail(id);
        return ResponseEntity.ok(memberResDto);
    }

    //회원 정보 수정
    @PostMapping("/update")
    public ResponseEntity<Boolean> updateMember(@RequestBody MemberReqDto memberReqDto){
        log.info("memberReqDto : {}", memberReqDto);
        return ResponseEntity.ok(memberService.modifyMember(memberReqDto));
    }

    //비밀번호 체크
    @PostMapping("/ispassword")
    public ResponseEntity<Boolean> checkPw(@RequestBody Map<String, String> data){
        Long id = SecurityUtil.getCurrentMemberId();
        String password = data.get("password");
        log.info("password : {}", password);
        return ResponseEntity.ok(memberService.isPassword(password, id));
    }

    // 멤버십 여부 업데이트
    @PostMapping("/membership")
    public ResponseEntity<Boolean> updateMembership(@RequestBody Map<String, Boolean> data){
        Long id = SecurityUtil.getCurrentMemberId();// 토근에서 id 정보를 가져옴
        log.info("id : {}", id);
        return ResponseEntity.ok(memberService.membershipSave(id));
    }

    @GetMapping("/iskiki")
    public ResponseEntity<Boolean> getIsMembership(){
        Long id = SecurityUtil.getCurrentMemberId();
        log.info("id : {}", id);
        return ResponseEntity.ok(memberService.isMembership(id));
    }

    // Admin - 회원 전체 조회
    @GetMapping("/admin/list")
    public ResponseEntity<List<AdminMemberDto>> adminMemList(){
        List<AdminMemberDto> list = memberService.getAdminMemList();
        return ResponseEntity.ok(list);
    }

    // Admin - 총 페이지 수
    @GetMapping("/admin/list/count")
    public ResponseEntity<Integer> adminMemberCount(@RequestParam (defaultValue = "10") int page,
                                                    @RequestParam(defaultValue = "0") int size){
        PageRequest pageRequest = PageRequest.of(page,size);
        int pageCnt = memberService.getAdminMemberPage(pageRequest);
        return ResponseEntity.ok(pageCnt);
    }
    // Admin - 회원조회 : 페이지네이션
    @GetMapping("/admin/list/page")
    public ResponseEntity<List<AdminMemberDto>> adminMemberList(@RequestParam (defaultValue = "0") int page,
                                                                @RequestParam (defaultValue = "10") int size) {
        List<AdminMemberDto> list = memberService.getAdminMemList(page, size);
        return ResponseEntity.ok(list);
    }

    // Admin - 회원정보 삭제
    @DeleteMapping("/admin/delete/{id}")
    ResponseEntity<Boolean> deleteMember(@PathVariable Long id){
        log.info("회원정보 삭제 {}", id);
        return ResponseEntity.ok(memberService.deleteMember(id));
    }


    // 월별 가입자
    @GetMapping("/admin/monthly")
    public ResponseEntity<List<Map <String, Object>>> monthlyUserList(){
        log.info("montly 진입");
        List<Map <String, Object>> list = memberService.getMonthlySignupCount();
        return ResponseEntity.ok(list);
    }


    // 회원 탈퇴
    @GetMapping("/withdraw")
    public ResponseEntity<Boolean> withdrawMember(){
        Long id = SecurityUtil.getCurrentMemberId();
        log.info("id : {}", id);
        return ResponseEntity.ok(memberService.withdrawMember(id));
    }




}