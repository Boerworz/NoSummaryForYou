//
//  SafariExtensionHandler.swift
//  NoSummaryForYouSafariExtension
//
//  Created by Tim Andersson on 2017-06-11.
//  Copyright © 2017 Cocoabeans Software. All rights reserved.
//

import SafariServices

class SafariExtensionHandler: SFSafariExtensionHandler {
    
    override func messageReceived(withName messageName: String, from page: SFSafariPage, userInfo: [String : Any]?) {
        NSLog("The extension received a message (\(messageName)) with userInfo (\(userInfo ?? [:])) from a script")

		switch messageName {
		case "stateChanged": handleStateChangeMessage(with: userInfo!)
		default: fatalError("Unrecognized message \"\(messageName)\" from script")
		}
    }

	private func handleStateChangeMessage(with userInfo: [String: Any]) {
		let isBlurEnabled = userInfo["blurEnabled"] as! Bool
		setToolbarItemBadgeText(to: isBlurEnabled ? nil : "OFF")
	}

	private func setToolbarItemBadgeText(to badgeText: String?) {
		SFSafariApplication.getActiveWindow {
			$0?.getToolbarItem { toolbarItem in
				toolbarItem?.setBadgeText(badgeText)
			}
		}
	}
    
    override func toolbarItemClicked(in window: SFSafariWindow) {
        NSLog("The extension's toolbar item was clicked")
		window.getActiveTab {
			$0?.getActivePage { page in
				NSLog("Sending message to script")
				page?.dispatchMessageToScript(withName: "toolbarItemClicked", userInfo: nil)
			}
		}
    }
    
    override func validateToolbarItem(in window: SFSafariWindow, validationHandler: @escaping ((Bool, String) -> Void)) {
        // This is called when Safari's state changed in some way that would require the extension's toolbar item to be validated again.
        validationHandler(true, "")
    }
    
    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }

}
