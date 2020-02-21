// initializing 
(function() {
  $(document).ready(function() {
    $(document).on("swell:setup", function() {
      SwellConfig.Referral.initializeReferral(".swell-referral");

      $(".the-wod-life-post-checkout").css("display", "flex");
      $( 'body' ).on('click',".the-wod-life-post-checkout .checkout-holder .swell-referral-back-link", function() {
        $(".the-wod-life-post-checkout").hide();
      });

      $(".swell-referral-loader").hide();

      setupReferrals();

      $( document ).on('click',"#swell-referral-register-submit", function() {
        setTimeout(function(){
          if(spapi.customer.referral_receipts) {
            setupReferrals();
            if(spapi.customer.email) {
              $(".swell-referral-content-main").addClass("refer-step");
            }
          } else {
            setTimeout(function(){
              setupReferrals();
              if(spapi.customer.email) {
                $(".swell-referral-content-main").addClass("refer-step");
              }
            },1000)
          }
        },1000)
      });

      $(document).on("click", ".swell-share-referral-copy", function(){
        setTimeout(function(){
          $(".swell-referral-content-main").html($(".swell-referral-copy").detach());
          $(".swell-referral-copy").css("display", "flex");
        }, 10);
      });

      $(document).on("swell:referral:success", function() {
        swellAPI.refreshCustomerDetails(function(){
          var customerDetails = swellAPI.getCustomerDetails();
          referrals = customerDetails.referrals;

          $(".redeem-holder").show();

          $(".swell-referral-table tbody").html("");

          referrals.forEach(function(referral) {
            status = null;

            if(referral.completedAt){ 
              status = "Purchased(" + spapi.activeReferralCampaign.reward_text + " earned)";
            } else {
              status = "Invited";
            }

            $(".swell-referral-table tbody").append('<tr> <td>' +  referral.email + '</td><td>' + status +'</td></tr>');
          });
        });
      });

      $(document).on("swell:referral:error", function(jqXHR, textStatus, errorThrown) { 
        if(textStatus && textStatus === "EMAILS_ALREADY_PURCHASED"){
          $(".refer-customer-error").remove();
          $(".swell-referral-form-body").prepend('<p class="refer-customer-error">Looks like we already know that email address.  Try again with another friend\'s email.</p>');
          $("#swell-referral-refer-emails").addClass("error-border");
        }
        if(textStatus && textStatus === "Please enter a valid email address"){
            $(".refer-customer-error").remove();
            $(".swell-referral-form-body").prepend('<p class="refer-customer-error">Please enter valid email addresses seperated with commas</p>');
            $("#swell-referral-refer-emails").addClass("error-border");
          }
      });
    });
  });

}).call(this);

function setupReferrals (){
  balance = 0;
  if(spapi.customer.email) {
    if(spapi.customer.referral_receipts.length > 0) {
      $(".redeem-holder").show();

      referrals = spapi.customer.referral_receipts;

      referrals.forEach(function(referral) {
        status = null;

        if(referral.completed_at){ 
          status = "Purchased(" + spapi.activeReferralCampaign.reward_text + " earned)";
          balance = balance + 5;
        } else {
          status = "Invited";
        }

        $(".swell-referral-table tbody").append('<tr> <td>' +  referral.email + '</td><td>' + status +'</td></tr>');
      });  
    }
    $(".swell-calculated-dollar-balance").html(balance);
  }
}

// referral
(function() {
  window.SwellConfig = window.SwellConfig || {};

  SwellConfig.Referral = {
    opts: {
      localization: {
        referralSidebarDetailsAction: "",
        referralSidebarDetailsReward: "",

        referralRegisterHeading: "<span class='refer-heading'>Refer a Friend</span>Give <%= referralCampaign.reward_text %>, Get <%= referralCampaign.reward_text %>",
        referralRegisterFormDetails: "",
        referralRegisterFormEmail: "Your email",
        referralRegisterFormSubmit: "Send",
        referralRegisterDetails: "<%= referralCampaign.details %>",

        referralReferHeading: "<span class='refer-heading'>Refer a Friend</span>Give <%= referralCampaign.reward_text %>, Get <%= referralCampaign.reward_text %>",
        referralReferFormEmails: "Your friends’ emails (separated by commas)",
        referralReferFormSubmit: "Send",
        referralReferFormDetails: "",
        referralReferFormEmailsDetails: "",
        referralReferDetails: "<%= referralCampaign.details %>",

        referralReferMediaDetails: "You can also share your link with the buttons below",

        referralShareFacebook: "Share",
        referralShareTwitter: "Share",
        referralShareCopy: "Copy Link",

        referralFacebookIcon: "swell-icon-facebook",
        referralTwitterIcon: "fa fa-twitter",
        referralLinkIcon: "swell-icon-link",

        referralThanksHeading: "Thanks for Referring!",
        referralThanksDetails: "Remind your friends to check their emails.",

        referralCopyHeading: "",
        referralCopyButton: "Copy Link",
        referralCopyDetails: "Copy link and share with your friends."
      },
      templates: {
        referralRegister: '<div class="swell-referral-register"> <h2 class="swell-referral-heading"><%= localization.referralRegisterHeading %></h2> <p class="swell-referral-details"> <%= localization.referralRegisterDetails %> </p> <div class="swell-referral-form-wrapper"> <form name="swell-referral-register-form" id="swell-referral-register-form" method="POST" action="."> <div class="swell-referral-form-header"> <p class="swell-referral-form-header-details"> <%= localization.referralRegisterFormDetails %> </p> </div> <div class="swell-referral-form-body"> <ul class="swell-referral-form-list"> <li class="swell-referral-form-list-field"> <input class="swell-referral-form-list-field-input" type="email" name="swell-referral-register-email" id="swell-referral-register-email" required="required" placeholder="<%= localization.referralRegisterFormEmail %>"> </li> <li class="swell-referral-form-list-field"> <input class="swell-referral-form-list-submit" type="submit" name="swell-referral-register-submit" id="swell-referral-register-submit" value="<%= localization.referralRegisterFormSubmit %>"> </li> </ul> </div> </form> </div> <div class="signup-link">Don’t have an account? <a href="/account/login">Sign up</a></div> </div>',
        referralRefer: '<div class="swell-referral-refer"> <h2 class="swell-referral-heading"><%= localization.referralReferHeading %></h2> <p class="swell-referral-details"> <%= localization.referralReferDetails %> </p> <div class="swell-referral-form-wrapper"> <form class="swell-referral-form" name="swell-referral-refer-form" id="swell-referral-refer-form" method="POST" action="."> <div class="swell-referral-form-header"> <p class="swell-referral-form-header-details"> <%= localization.referralReferFormDetails %> </p> </div> <div class="swell-referral-form-body"> <ul class="swell-referral-form-list"> <li class="swell-referral-form-list-field"> <input class="swell-referral-form-list-field-input" type="text" name="swell-referral-refer-emails" id="swell-referral-refer-emails" required="required" placeholder="<%= localization.referralReferFormEmails %>"> </li> <li class="swell-referral-form-list-field"> <input class="swell-referral-form-list-submit" type="submit" name="swell-referral-refer-submit" id="swell-referral-refer-submit" value="<%= localization.referralReferFormSubmit %>"> </li> </ul> </div> </form> </div> <div class="swell-referral-media-wrapper"> <p class="swell-referral-media-details"> <%= localization.referralReferMediaDetails %> </p> <ul class="swell-referral-media-list"> <li class="swell-referral-medium swell-share-referral-facebook"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralFacebookIcon %>" aria-hidden="true"></i>&nbsp; <%= localization.referralShareFacebook %> </div> </li> <li class="swell-referral-medium swell-share-referral-sms"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon swell-icon-message" aria-hidden="true"></i>&nbsp;SMS </div> </li> <li class="swell-referral-medium swell-share-referral-messenger"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon swell-icon-messenger" aria-hidden="true"></i>&nbsp;Message</div> </li> <li class="swell-referral-medium swell-share-referral-copy"> <div class="swell-referral-medium-content"> <i class="swell-referral-media-icon <%= localization.referralLinkIcon %>" aria-hidden="true"></i>&nbsp; <%= localization.referralShareCopy %> </div> </li> </ul> </div> </div>',
        referralCopy: '<div class="swell-referral-copy"> <div class="swell-referral-copy-content"> <div class="swell-referral-copy-sidebar"></div> <div class="swell-referral-copy-main"> <span class="swell-referral-back-link"></span> <h2 class="swell-referral-heading"> <i class="swell-referral-heading-icon <%= localization.referralLinkIcon %>" aria-hidden="true"></i>&nbsp;<%= localization.referralCopyHeading %> </h2> <div class="swell-referral-form-wrapper"> <div class="swell-referral-copy-link" id="swell-referral-copy-link"><%= customer.referralLink %></div> <p class="swell-referral-details"><%= localization.referralCopyDetails %></p> <button class="swell-referral-copy-button" id="swell-referral-copy-button" data-clipboard-target="#swell-referral-copy-link"><%= localization.referralCopyButton %></button> </div> </div> </div> <div>',  
        referralThanks: '<div class="swell-referral-thanks"> <div class="swell-referral-thanks-holder"> <span class="swell-referral-back-link"></span> <h2 class="swell-referral-heading"><%= localization.referralThanksHeading %></h2> <p class="swell-referral-details"><%= localization.referralThanksDetails %></p> </div> </div>'
      }
    },
    initializeReferral: function(containerSelector) {
      var email = $(containerSelector).data("customer-email");
      if (email) {
        spapi.storage.setItem("referrer_email", email);
        spapi.customer.email = email;
      }
      Swell.Referral.initializeReferral(".swell-referral", SwellConfig.Referral.opts);
    }
  };
}).call(this);
