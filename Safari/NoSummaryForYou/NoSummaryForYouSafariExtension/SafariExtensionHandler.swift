//
//  SafariExtensionHandler.swift
//  NoSummaryForYouSafariExtension
//
//  Created by Tim Andersson on 2017-06-11.
//  Copyright © 2017 Cocoabeans Software. All rights reserved.
//

import SafariServices

class SafariExtensionHandler: SFSafariExtensionHandler {
    
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
