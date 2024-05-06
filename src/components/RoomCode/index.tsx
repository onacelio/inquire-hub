import copyIcon from '../../assets/images/copy.svg'

import './roomCode.scss'

type RoomCodeProps = {
  code: string ;
}

export function RoomCode(props: RoomCodeProps) {
  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.code!)
  }

  return (
    <button className="room-code" onClick={copyRoomCodeToClipboard}>
      <div><img src={copyIcon} alt="Icon copy" /></div>
      <span>Sala #{props.code}</span>
    </button>
  )
}