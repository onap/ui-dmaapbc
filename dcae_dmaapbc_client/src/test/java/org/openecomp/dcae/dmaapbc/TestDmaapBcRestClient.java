package org.openecomp.dcae.dmaapbc;

import java.util.List;

import org.junit.Test;
import org.openecomp.dcae.dmaap.bcapi.client.DmaapBcRestClient;
import org.openecomp.dcae.dmaap.bcapi.client.HttpStatusAndResponse;
import org.openecomp.dcae.dmaapbc.model.DmaapObject;
import org.openecomp.dcae.dmaapbc.model.Feed;
import org.openecomp.dcae.dmaapbc.model.Topic;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TestDmaapBcRestClient {

	private static Logger logger = LoggerFactory.getLogger(TestDmaapBcRestClient.class);

	/**
	 * Exercises some of the DMaaP Bus Controller client's functionality.
	 */
	@Test
	public void test() throws Exception {
		DmaapBcRestClient client = new DmaapBcRestClient("https://host:8443/webapi/",
				"host", "MechIdPassword");

		// This may help when in a hurry, but it's dangerous.
		// client.setFailOnUnknownProperties(false);

		DmaapObject dmaap = client.getDmaap();
		if (dmaap == null)
			logger.warn("Failed to get DMAAP");
		else
			logger.info("DMAAP is " + dmaap.toString());

		List<DmaapObject> locs = client.getDcaeLocations();
		if (locs == null) {
			logger.warn("Failed to get DCAE locations");
		} else {
			logger.info("Loc count is " + locs.size());
			for (DmaapObject loc : locs)
				logger.info("Location is: " + loc.toString());
		}

		List<DmaapObject> nodes = client.getDRNodes();
		if (nodes == null) {
			logger.warn("Failed to get nodes");
		} else {
			logger.info("node count is " + nodes.size());
			for (DmaapObject node : nodes)
				logger.info("Nodeis: " + node.toString());
		}

		List<DmaapObject> drPubs = client.getDRPubs();
		if (drPubs == null) {
			logger.warn("Failed to get DR pubs");
		} else {
			logger.info("DR_Pub count is " + drPubs.size());
			for (DmaapObject pub : drPubs)
				logger.info("DR_Pub is: " + pub.toString());
		}
		List<DmaapObject> drSubs = client.getDRSubs();
		if (drSubs == null) {
			logger.warn("Failed to get DR subs");
		} else {
			logger.info("DR_Sub count is " + drSubs.size());
			for (DmaapObject sub : drSubs)
				logger.info("DR_Sub is: " + sub.toString());
		}

		List<DmaapObject> feeds = client.getFeeds();
		if (feeds == null) {
			logger.warn("Failed to get feeds");
		} else {
			logger.info("Feed count is " + feeds.size());
			for (DmaapObject feed : feeds)
				logger.info("Feed is: " + feed.toString());
		}
		List<DmaapObject> topics = client.getTopics();
		if (topics == null) {
			logger.warn("Failed to get topics");
		} else {
			logger.info("Topic count is " + topics.size());
			for (DmaapObject topic : topics)
				logger.info("Topic is: " + topic.toString());
		}
		List<DmaapObject> clients = client.getMRClients();
		if (clients == null) {
			logger.warn("Failed to get MR clients");
		} else {
			logger.info("MR client count is " + clients.size());
			for (DmaapObject mrc : clients)
				logger.info("MR client is: " + mrc.toString());
		}
		List<DmaapObject> clusters = client.getMRClusters();
		if (clusters == null) {
			logger.warn("Failed to get MR clusters");
		} else {
			logger.info("MR cluster count is " + clusters.size());
			for (DmaapObject mrc : clusters)
				logger.info("MR cluster is: " + mrc.toString());
		}

		// Create and delete feed

		Feed feed = (Feed) feeds.get(0);
		final String feedId = "987654321";
		final String feedName = "TestFeed1234567890";
		final String feedUrl = "http://host.com/foo/bar";
		feed.setFeedId(feedId);
		feed.setFeedName(feedName);
		feed.setPublishURL(feedUrl);
		HttpStatusAndResponse<Object> addFeedResp = client.postFeed(feed);
		if (addFeedResp.getStatusCode() == 200)
			logger.info("add feed succeeded, response is " + addFeedResp);
		else
			logger.error("add feed failed, response is " + addFeedResp);

		DmaapObject getFeedResp = client.getFeed(feedId);
		logger.info("get feed response is " + getFeedResp);
		HttpStatusAndResponse<Object> delFeedResp = client.deleteFeed(feedId);
		if (delFeedResp.getStatusCode() == 200)
			logger.info("delete feed succeeded, response is " + delFeedResp);
		else
			logger.error("delete feed failed, response is " + delFeedResp);

		// Attempt to create empty feed should fail -- but does not
		// Feed emptyFeed = new Feed();
		// HttpStatusAndResponse<Object> addEmptyFeedResp =
		// client.postFeed(emptyFeed);
		// if (addEmptyFeedResp.getStatusCode() == 200)
		// logger.info("add feed succeeded, response is " + addFeedResp);
		// else
		// logger.error("add feed failed, response is " + addFeedResp);

		// Create and delete topic

		Topic topic = new Topic();
		final String fqtn = "host";
		topic.setFqtn(fqtn);
		HttpStatusAndResponse<Object> createTopicResp = client.postTopic(topic);
		logger.info("create topic response is " + createTopicResp);
		DmaapObject getTopicResp = client.getTopic(fqtn);
		logger.info("get topic response is " + getTopicResp);
		HttpStatusAndResponse<Object> delTopic = client.deleteTopic(fqtn);
		if (delTopic.getStatusCode() == 200)
			logger.info("del topic succeeded, response is " + delTopic);
		else
			logger.error("del topic failed, response is " + delTopic);
		HttpStatusAndResponse<Object> delTopicMissing = client.deleteTopic(fqtn);
		if (delTopicMissing.getStatusCode() == 204)
			logger.info("del of missing topic succeeded, response is " + delTopicMissing);
		else
			logger.error("del of missing topic failed, response is " + delTopic);

		logger.info("ends");

	}

}
