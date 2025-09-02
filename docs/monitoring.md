# Monitoring and Evaluation

## Metrics Collection

YSearch2 collects various metrics to monitor system performance and user engagement:

### Search Metrics
- **Query Count**: Total number of search queries processed
- **Average Response Time**: Average time taken to process search queries
- **Success Rate**: Percentage of successful search queries
- **Personalization Rate**: Percentage of queries that used personalization

### Agent Metrics
- **Process Count**: Number of times each agent has been invoked
- **Average Processing Time**: Average time taken by each agent to process requests
- **Error Count**: Number of errors encountered by each agent

## Monitoring Endpoints

### Get Metrics
```
GET /metrics
```
Returns a summary of all collected metrics.

### Flush Metrics
```
POST /metrics/flush
```
Flushes metrics to persistent storage.

## Feedback Collection

User feedback is crucial for the continuous learning capabilities of YSearch2:

### Record Feedback
```
POST /feedback
```
Records user feedback on search results.

### Process Feedback
```
POST /process_feedback
```
Processes accumulated feedback for agent tuning.

### Recent Feedback
```
GET /feedback/recent
```
Retrieves recent feedback entries.

## Performance Monitoring

The system automatically tracks:
- Response times for each component
- Error rates and failure patterns
- Resource utilization
- User engagement metrics

## Setting up Alerts

For production deployments, you should set up alerts for:
- High error rates (>5%)
- Slow response times (>2 seconds average)
- System downtime
- Low user engagement

## Evaluation Methods

### Offline Evaluation
- A/B testing of different agent configurations
- Historical data analysis
- Query relevance assessment

### Online Evaluation
- Real-time user feedback analysis
- Click-through rate monitoring
- User satisfaction surveys

## Best Practices

1. Regularly flush metrics to persistent storage
2. Monitor for performance degradation over time
3. Use feedback data to improve agent parameters
4. Track user engagement to measure system effectiveness
5. Set up automated alerts for critical metrics