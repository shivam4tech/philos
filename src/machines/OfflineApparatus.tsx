import { MachineFrameBackOnly } from './MachineFrameBackOnly'

/**
 * Fallback shown when a registry entry has no implemented component yet.
 * Also the last-resort error surface for a crashed apparatus.
 */
export default function OfflineApparatus() {
  return (
    <MachineFrameBackOnly>
      <div className="offline">
        <p className="microlabel">APPARATUS STATUS</p>
        <h2>OFFLINE — CALIBRATION PENDING</h2>
        <p className="offline__note">
          THIS UNIT IS REGISTERED BUT HAS NOT BEEN ENERGIZED. THE INSTITUTE DOES NOT
          CURRENTLY ACCEPT INTERACTION COMPLAINTS.
        </p>
      </div>
    </MachineFrameBackOnly>
  )
}
