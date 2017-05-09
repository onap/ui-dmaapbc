package org.openecomp.fusionapp.util;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.filter.Filter;
import ch.qos.logback.core.spi.FilterReply;

/**
 * Custom Filter class bind with logback.xml configuration file to strip out
 * certain log messages coming out of special packages or classes.
 *
 */
public class CustomLoggingFilter extends Filter<ILoggingEvent> {

	/**
	 * Custom Filter is added to strip out the continuous U-EB logging messages
	 * But make sure we log the ERROR and WARNING Level messages.
	 * 
	 * @param event
	 *            Logging event
	 */
	@Override
	public FilterReply decide(ILoggingEvent event) {
		try {
			if ((event.getLevel() != Level.ERROR || event.getLevel() != Level.WARN)
					&& (event.getThreadName().equalsIgnoreCase("UEBConsumerThread"))
					&& (event.getLoggerName().contains("com.att.nsa")
							|| event.getLoggerName().contains("org.apache.http"))) {
				return FilterReply.DENY;
			} else {
				return FilterReply.NEUTRAL;
			}
		} catch (Exception e) {
			return FilterReply.NEUTRAL;
		}
	}
}
