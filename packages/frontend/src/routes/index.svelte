<script>
  import { goto } from "@sapper/app";
  import Button from "../components/Button.svelte";

  let checked = false;
  let error = "";
  const go = () => {
    if (!checked) {
      error = "Please agree to the terms and conditions";
    } else {
      goto("contribute");
    }
  };
</script>

<style lang="scss">
  div.disclaimer {
    font-size: 0.8rem;
    max-height: 50vh;
    overflow: scroll;
  }

  div.checkbox {
    margin: 2 * $GU 0;
  }

  div.error {
    color: $red;
    font-size: 0.9rem;
    margin-top: 2 * $GU;
  }
</style>

<div class="disclaimer">
  <h2>API3 Token Disclaimer</h2>
  <p>
    To any and all prospective holders, purchasers, assignees, or transferees
    (“You” or “Your”, as applicable) of the API3 Ethereum tokens (“API3
    Tokens”), by your participation in the relevant token distribution and
    interaction with the materials herein and with the API3 Tokens themselves,
    You acknowledge Your understanding and agreement with the disclaimers
    herein:
  </p>
  <p>
    API3 tokens permit governing, directing, and participating in the API3
    Decentralized Autonomous Organization (“API3 DAO”), and are not to be
    treated as investments of any nature. The API3 Token confers only membership
    in the API3 DAO and do not impart or guarantee any economic benefits or
    returns of any kind to its holders, and staking the API3 Token may involve
    different risks of loss of the API3 Token, including but not limited to the
    data feed insurance incentives and penalties (more thoroughly described at
    api3.org). The operation, maintenance and overall success of the API3 DAO
    and protocol depends on the efforts of a disparate group of actors
    constituting the API3 DAO and sub-DAOs therein, and as such the products and
    services described herein involve substantial risk. Materials published by
    the API3 DAO, API3 Limited Company (the “API3 Company”), The API3 Foundation
    Limited Company (the “API3 Foundation”), or any affiliate or related entity
    to the foregoing (collectively, “API3”) do not constitute the provision of
    advisory services regarding investment, tax, legal, financial, accounting,
    consulting or any other related services, nor are they a recommendation to
    purchase any token, product or service. All materials published by API3
    reflect the information available as of the time of publishing, are subject
    to change at any time without notice, and shall in no circumstance incur any
    liability for any direct or consequential loss arising out of the use of any
    API3 materials or communications.
  </p>
  <p>
    You represent and warrant You are not: (i) in violation of any laws relating
    to economic sanctions, anti-money laundering, or anti-corruption; (ii)
    restricted or prohibited in dealings by a global sanctions authority
    (including but not limited to the Security Council of the United Nations,
    the European Union, or the U.S. Office of Foreign Assets and Control) (a
    "Sanctions Authority"), (iii) a citizen of or domiciled in (at any time) a
    country sanctioned by a Sanctions Authority including, but not limited to,
    Cuba, Iran, Syria, North Korea, and the Crimea region of Ukraine; and (iv) a
    citizen of or domiciled in any of the following jurisdictions for the API3
    Token distribution: the United States (including its territories and
    dependencies, any state of the United States and the District of Columbia),
    Afghanistan, Ethiopia, Guyana, Iraq, Sudan, or Yemen.
  </p>
  <p>
    API3 has undertaken commercially reasonable screening measures, to the
    extent possible in a distribution performed by a decentralized exchange and
    accompanying DAO, to prevent any excluded persons or jurisdictions from
    participating in the sale, but as an additional measure relies upon Your
    representation that You are not excluded from participation in accord with
    the foregoing. Furthermore, API3 expressly disclaims and disavows any
    secondary transfers, sales, or assignments of the API3 Tokens by You and
    shall have no liability whatsoever for any such actions, further recipients,
    or usage of the API3 Tokens.
  </p>
  <p>
    Purchasing API3 Tokens for membership in the API3 DAO involves a high degree
    of various risks, including a possible loss of the entire purchase price.
    API3 DAO’s sector and market is highly competitive, new, and subject to
    innumerable legal and regulatory uncertainties, including as to the status
    or classification of the API3 Token itself and its distribution, the status
    of the API3 DAO and its dealings, and the legal and regulatory treatment of
    the wider decentralized technology space generally. ​At any time the API3
    Company and/or the API3 Foundation may be compelled to cease operations or
    take actions that result in its dissolution—while such actions may not
    affect the continuance of the API3 DAO, they may impact API3 DAO’s and
    API3’s developments, legal classification, intellectual property status,
    commercial relationships, and other interactions between the various
    entities that support the development of API3. ​
  </p>
  <p>
    A private key, or a combination of private keys, is necessary to send and
    otherwise interact with API3 Tokens stored in Your Ethereum wallet.
    Accordingly, loss of sole control of such private key(s) (including by any
    third party’s access to such private keys) associated with Your wallet can
    result in a loss of such API3 Tokens. Further, Your failure to properly
    follow the procedures for API3 Token distribution, for example providing an
    incorrect or non-compatible wallet address, may result in the loss of Your
    API3 Tokens.
  </p>
  <p>
    The API3 protocol is still under development and may undergo significant
    changes over time and although API3 intends for the API3 Tokens to function
    as described in the materials herein and accompanying whitepaper, the API3
    DAO is free to alter the course of development or services (including the
    usage or purpose of API3 Tokens) as it chooses/as deemed advisable by the
    direction of API3 Token holders. Therefore, API3 Tokens may not meet any
    specific expectations You may have concerning the API3 Token’s value,
    utility, or usage. ​
  </p>
  <p>
    Malicious actors may attempt to interfere with the token distribution
    platform or the API3 Tokens in a variety of ways, including, but not limited
    to, malware attacks, denial of service attacks, consensus-based attacks,
    Sybil attacks, smurfing and spoofing, any of the foregoing in manners out of
    API3’s control. Furthermore, because the API3 protocol and DAO is
    substantially based on open source software, there is a risk that a third
    party or an API3 member may intentionally or unintentionally introduce
    weaknesses into the core infrastructure of the API3 DAO, which could
    negatively affect the API3 Tokens, including their utility for accessing the
    API3 DAO or related services.
  </p>
  <p>
    The legal and regulatory status and classification of API3 Tokens, DAOs,
    governance tokens generally and blockchain technology generally is unclear
    or unsettled in many jurisdictions. It is difficult to predict how or
    whether governments and regulatory agencies may apply existing regulations
    and law, or enact future regulations or legislation, with respect to such
    technology and its future applications, including the API3 DAO and the API3
    Tokens. Enforcement actions could negatively impact API3 and the API3 Tokens
    in various ways, including but not limited to (solely for purposes of
    illustration) through a determination that the offering and
    distribution/purchase of the API3 Tokens constitutes unlawful activity or
    that the API3 Tokens represent regulated instruments requiring registration
    or licensing of those instruments or some or all of the parties involved in
    the offering and distribution/purchase thereof. API3 may cease to offer its
    services to people in specific jurisdictions in the event that regulatory
    actions, or changes to law or regulation make it illegal to operate in such
    jurisdiction, or commercially undesirable for API3 to obtain the necessary
    regulatory approval(s) to operate in such jurisdiction.
  </p>
  <p>
    THIS WEBSITE, THE LINKS AND OTHER MATERIALS PROVIDED HEREIN, AND ANY
    COMMUNICATIONS RELATED TO ANY OF THE FOREGOING ARE NOT INTENDED TO
    CONSTITUTE AN OFFER TO SELL, OR SOLICITATION OF AN OFFER TO BUY, ANY
    SECURITIES. ANY AND ALL ‘SECURITIES’ REFERRED TO HEREIN, SHOULD THEY BE SO
    DESIGNATED BY A REGULATORY ENTITY WITH JURISDICTION, HAVE NOT BEEN
    REGISTERED UNDER ANY APPLICABLE SECURITIES LAWS. NEITHER THE CAYMAN ISLANDS
    MONETARY AUTHORITY NOR THE SECURITIES AND EXCHANGE COMMISSION NOR ANY OTHER
    SECURITIES COMMISSION OR AGENCY HAS REVIEWED OR CONFIRMED THE ACCURACY OR
    ADEQUACY OF THE CONTENTS HEREOF.
  </p>
  <p>
    NOTHING SET FORTH HEREIN IS INTENDED TO BE LEGAL, TAX OR FINANCIAL ADVICE TO
    ANY ENTITY OR PERSON. NO REPRESENTATION, WARRANTY OR ASSURANCE IS MADE
    REGARDING THE ACCURACY OF THE INFORMATION CONTAINED HEREIN, AND IT IS NOT
    INTENDED TO BE RELIED UPON BY ANY PERSON. THE INFORMATION CONTAINED HEREIN
    MAY NOT REFLECT SUBSEQUENT DEVELOPMENTS.
  </p>
  <p>
    THE FORWARD-LOOKING STATEMENTS IN THIS WEBSITE OR THE LINKS AND OTHER
    RELATED MATERIALS ARE SUBJECT TO NUMEROUS ASSUMPTIONS, RISKS AND
    UNCERTAINTIES WHICH ARE SUBJECT TO CHANGE OVER TIME. THERE ARE MANY RISK
    FACTORS, INCLUDING THOSE RELATING TO DISTRIBUTED LEDGER AND BLOCKCHAIN
    TECHNOLOGY GENERALLY, AS WELL ANY OPERATIONS AND RESULTS OF OPERATIONS, THAT
    COULD CAUSE ACTUAL RESULTS OR DEVELOPMENTS TO NOT BE REALIZED IN WHOLE OR IN
    PART OR, EVEN IF SUBSTANTIALLY REALIZED, TO FAIL TO ACHIEVE ANY OR ALL OF
    THE BENEFITS THAT COULD BE EXPECTED THEREFROM. API3 AND ALL RELATED AND/OR
    INTERESTED ENTITIES RESERVE THE RIGHT TO CHANGE THE PLANS, EXPECTATIONS AND
    INTENTIONS STATED HEREIN AT ANY TIME AND FOR ANY REASON, IN THEIR RESPECTIVE
    SOLE AND ABSOLUTE DISCRETION, AND, EXCEPT AS MAY BE OTHERWISE REQUIRED BY
    APPLICABLE LAW. API3 UNDERTAKES NO OBLIGATION TO UPDATE PUBLICLY OR REVISE
    ANY FORWARD-LOOKING STATEMENT, WHETHER AS A RESULT OF NEW INFORMATION,
    FUTURE DEVELOPMENTS OR OTHERWISE. YOU DO NOT RELY ON, AND DO NOT MAKE ANY
    FINANCIAL DECISION OR INVESTMENT BASED ON, THE STATEMENTS CONTAINED IN THIS
    WEBSITE, THE LINKS AND OTHER MATERIALS PROVIDED HEREIN, AND ANY RELATED
    COMMUNICATIONS -- INCLUDING BUT NOT LIMITED TO ANY SELLING OR TRADING OF ANY
    CRYPTOGRAPHIC OR BLOCKCHAIN TOKEN FOR THE PURPOSES OF GOVERNANCE OR ANY
    OTHER PURPOSE, OR THE SECURITIES OF ANY COMPANY OR OTHER ORGANIZATION OR
    GROUP.
  </p>
</div>
<div class="checkbox">
  <input type="checkbox" name="agree" bind:checked />
  <label for="agree">
    I agree to the API3 governance distribution terms and conditions
  </label>
</div>
<Button value="Go to governance distribution" on:click={go} />
<div class="error">{error}</div>
