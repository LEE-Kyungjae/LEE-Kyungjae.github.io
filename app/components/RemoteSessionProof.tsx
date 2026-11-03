import './remote-session-proof.css';
const root='/assets/projects/purpose-evidence-20261103/';
export default function RemoteSessionProof(){return <section className="remote-session-proof" aria-label="아델리 실제 접속과 작업 유지">
 <header><small>원본 웹·릴레이·커넥터 실행 · 2026-11-03</small><h2>브라우저를 떠난 뒤 같은 작업으로 돌아오기</h2><p>웹에서 로컬 머신의 tmux 세션에 접속해 명령을 실행했습니다. 작업 도중 브라우저가 앱을 떠나도 호스트에서는 실행이 계속되고, 다시 접속하면 같은 세션의 결과를 확인할 수 있습니다.</p></header>
 <div className="remote-route" aria-label="실행한 연결 경로"><span>웹 클라이언트</span><b>↔</b><span>릴레이</span><b>↔</b><span>외부 연결 커넥터</span><b>↔</b><span>로컬 tmux</span></div>
 <div className="remote-captures">{[['termi-mobile-running.png','01','명령 실행','웹에서 입력한 작업의 첫 번째 출력'],['termi-mobile-return.png','02','앱으로 복귀','11초 뒤 나타난 마지막 세션 이어서 열기'],['termi-mobile-completed.png','03','결과 확인','같은 세션에 남은 다섯 단계와 완료 출력']].map(([file,n,title,caption])=><figure key={file}><figcaption><span>{n}</span><h3>{title}</h3><p>{caption}</p></figcaption><a href={root+file} target="_blank" rel="noreferrer" aria-label={title+' 원본 화면 크게 보기'}><img src={root+file} alt={caption+' — 아델리 원본 웹 화면'} loading="lazy"/></a></figure>)}</div>
 <div className="remote-record"><div><h3>호스트에 남은 실행 결과</h3><p>스크린샷의 작은 글자도 확인할 수 있도록 원본 터미널에서 읽은 출력 일부를 함께 표시합니다.</p><a href={root+'termi-session.json'} target="_blank" rel="noreferrer">실행 절차·전체 출력 ↗</a></div><pre>{'SESSION-PROOF-20261103\nstep 1/5\nstep 2/5\nstep 3/5\nstep 4/5\nstep 5/5\nTASK-COMPLETE'}</pre></div>
 <p className="remote-scope">원본 소스를 격리된 로컬 환경에서 실행했습니다. 화면은 모바일 크기의 브라우저 캡처이며 실물 휴대폰 촬영은 아닙니다. 커넥터 페어링과 터미널 작업 유지는 확인했지만, 외부 인터넷·계정 로그인·AI 실행은 이번 기록의 검증 범위에 포함되지 않습니다.</p>
 </section>}
