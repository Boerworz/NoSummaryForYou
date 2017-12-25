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
		setToolbarItemImage(to: NSImage(named: isBlurEnabled ? .toolbarItemIconEnabled : .toolbarItemIconDisabled)!)
	}

	private func setToolbarItemImage(to newToolbarItemImage: NSImage) {
		logDebugMessage("setToolbarItemImage(to:) called")
		SFSafariApplication.getActiveWindow { (window) in
			window?.getToolbarItem(completionHandler: { (toolbarItem) in
				self.logDebugMessage("Calling SFSafariToolbarItem.setImage(_:) with \(newToolbarItemImage)")
				toolbarItem?.setImage(newToolbarItemImage)
			})
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
		window.getActiveTab { (tab) in
			tab?.getActivePage { (page) in
				page?.getPropertiesWithCompletionHandler { (pageProperties) in
					// We can't get the url for a tab that is visiting a domain that we haven't declared
					// in our Info.plist, so if we get `nil` back we know we should disable the toolbar item.
					let isVisitingSupportedDomain = pageProperties?.url != nil
					validationHandler(isVisitingSupportedDomain, "")
				}
			}
		}
	}
    
    override func popoverViewController() -> SFSafariExtensionViewController {
        return SafariExtensionViewController.shared
    }

}

private extension NSImage.Name {
	static let toolbarItemIconEnabled = NSImage.Name(rawValue: "ToolbarItemIconEnabled.pdf")
	static let toolbarItemIconDisabled = NSImage.Name(rawValue: "ToolbarItemIconDisabled.pdf")
}
