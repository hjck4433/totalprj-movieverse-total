package com.totalprj.movieverse.repository;

import com.totalprj.movieverse.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByEmail(String email);
    boolean existsByAlias(String alias);
    boolean existsByPhone(String phone);

    boolean existsByPassword(String password);
    Optional<Member> findByEmail(String email);
    Optional<Member> findByEmailAndPassword(String email, String password);
    // 월별 가입자 수를 조회하는 쿼리
    @Query("SELECT MONTH(m.regDate) as month, COUNT(m) as count FROM Member m WHERE YEAR(m.regDate) = YEAR(CURRENT_DATE) GROUP BY MONTH(m.regDate)")
    List<Map<String, Object>> getMonthlySignupCount();


}